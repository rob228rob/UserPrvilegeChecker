#include <napi.h>
#include <windows.h>
#include <lm.h>

#pragma comment(lib, "netapi32.lib")

std::string GetUserPrivilege(const std::string& username) {
    std::wstring wideUsername(username.begin(), username.end());
    DWORD dwLevel = 1;
    LPUSER_INFO_1 pBuf = NULL;
    NET_API_STATUS nStatus;
    std::string privilege = "NotFound";

    nStatus = NetUserGetInfo(NULL, wideUsername.c_str(), dwLevel, (LPBYTE*)&pBuf);
    if (nStatus == NERR_Success) {
        if (pBuf->usri1_priv == USER_PRIV_ADMIN) {
            privilege = "admin";
        } else if (pBuf->usri1_priv == USER_PRIV_USER) {
            privilege = "user";
        } else if (pBuf->usri1_priv == USER_PRIV_GUEST) {
            privilege = "guest";
        }
    }

    if (pBuf != NULL) {
        NetApiBufferFree(pBuf);
    }

    return privilege;
}

Napi::String GetUserPrivilegeWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::String username = info[0].As<Napi::String>();
    std::string result = GetUserPrivilege(username.Utf8Value());
    return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getUserPrivilege"), Napi::Function::New(env, GetUserPrivilegeWrapped));
    return exports;
}

NODE_API_MODULE(addon, Init)