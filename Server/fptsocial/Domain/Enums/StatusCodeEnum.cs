using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum StatusCodeEnum
    {
        Success = 0,
        [Description("System Error")]
        Error,
        [Description("User not found")]
        U01_Not_Found,
        [Description("")]
        Context_Not_Found,
        [Description("User is locked")]
        U02_Lock_User,
        [Description("User is Existed")]
        U03_User_Exist,
        [Description("Can not create user with Email and FeId is null")]
        U04_Can_Not_Create,
    }
}
