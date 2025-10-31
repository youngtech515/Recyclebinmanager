#include <windows.h>
#include <shlobj.h>
#include <shlwapi.h>
#include <iostream>

#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "ole32.lib")

int main() {
    CoInitialize(NULL);
 
    IShellFolder* pDesktop = NULL;
    IShellFolder* pRecycleBin = NULL;

    // Get Desktop Folder
    SHGetDesktopFolder(&pDesktop);

    // Get PIDL of Recycle Bin
    LPITEMIDLIST pidlRecycleBin = NULL;
    SHGetSpecialFolderLocation(NULL, CSIDL_BITBUCKET, &pidlRecycleBin);

    // Bind to Recycle Bin folder
    pDesktop->BindToObject(pidlRecycleBin, NULL, IID_IShellFolder, (void**)&pRecycleBin);

    // Enumerate items
    IEnumIDList* pEnum = NULL;
    pRecycleBin->EnumObjects(NULL, SHCONTF_FOLDERS | SHCONTF_NONFOLDERS, &pEnum);

    LPITEMIDLIST pidlItem;
    ULONG fetched = 0;

    STRRET str;
    while (pEnum->Next(1, &pidlItem, &fetched) == S_OK) {
        pRecycleBin->GetDisplayNameOf(pidlItem, SHGDN_NORMAL, &str);
        CHAR szName[MAX_PATH];
        StrRetToBufA(&str, pidlItem, szName, MAX_PATH);
        std::cout << "Deleted item: " << szName << std::endl;
        CoTaskMemFree(pidlItem);
    }

    pEnum->Release();
    pRecycleBin->Release();
    pDesktop->Release();
    CoTaskMemFree(pidlRecycleBin);
    CoUninitialize();
}
com