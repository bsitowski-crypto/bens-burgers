"""One-time checked transport of the already-tested v32 WebP sprite atlas."""
from pathlib import Path
import base64
import hashlib
import re

PATCHES = {
    2: ('8ef461e1683268d12d45e8f90b66cebe72440931aac1756fbfffefbd83d19c10', [(1872,1874,''),(2217,2219,'Z'),(2687,2688,'y')]),
    3: ('cf90aa488d01cf96a160572b7251d88aa79d653e8f2fb82bdfc6412492a4072a', [(437,439,''),(447,449,'mv')]),
    4: ('68fb2052fca5883f207613caf08a89d6158ed40f262d8d8a100aeb35043ef428', [(7410,7423,'')]),
}
EXPECTED = 'ccf4f74782f1f155632fdb3c66ffee016af7752f047838aceebbaf7aaad01dda'
output = Path('stand-art-v32.webp')
if output.exists():
    assert hashlib.sha256(output.read_bytes()).hexdigest() == EXPECTED
else:
    parts = []
    for n in range(1,12):
        text = Path(f'v32-texture-{n}.js').read_text(encoding='utf8')
        if n in PATCHES:
            before, edits = PATCHES[n]
            assert hashlib.sha256(text.encode()).hexdigest() == before, f'Unexpected transfer contents in part {n}'
            for start, end, replacement in reversed(edits):
                text = text[:start] + replacement + text[end:]
        match = re.search(r'PARTS.push\("([A-Za-z0-9+/=]+)"\)', text)
        assert match, f'Missing part {n}'
        parts.append(match[1])
    data = base64.b64decode(''.join(parts), validate=True)
    assert len(data) == 66704
    assert hashlib.sha256(data).hexdigest() == EXPECTED, 'Native artwork differs from the tested image'
    output.write_bytes(data)
print('Verified native v32 texture:', EXPECTED)
