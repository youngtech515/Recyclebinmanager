#include <windows.h>
#include <shlobj.h>
#include <stdio.h>

int main(void) {
    SHQUERYRBINFO qinfo;
    qinfo.cbSize = sizeof(SHQUERYRBINFO);

    HRESULT hr = SHQueryRecycleBin(NULL, &qinfo);
    if (SUCCEEDED(hr)) {
        printf("Recycle Bin contains %llu items, total size: %llu bytes\n",
               qinfo.i64NumItems, qinfo.i64Size);
    } else {
        printf("Failed to query Recycle Bin: 0x%lx\n", hr);
    }
    return 0; 
}
