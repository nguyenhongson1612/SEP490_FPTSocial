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
        [Description("User don't have any web affilication")]
        U05_Not_Has_WebAffilication,
        [Description("Gender is existed in data")]
        G01_Gender_Existed,
        [Description("Gender is not found")]
        G02_Gender_Not_Found,
        [Description("Status not found")]
        ST01_Status_Not_Found,
        [Description("Status is existed")]
        ST02_Status_Existed,
        [Description("Relationship is existed")]
        RL01_Relationship_Existed,
        [Description("Setting is existed")]
        S01_Settings_Existed,
        [Description("Role is existed")]
        R01_Role_Existed,
        [Description("Interest is existed")]
        IT01_Interest_Existed,
        [Description("Post not found")]
        P01_Not_Found,
        [Description("Can not send friend")]
        FR01_Cannot_Send,
        [Description("Accept friend")]
        FR02_Accept_Friend,
        [Description("Cancle friend")]
        FR03_Cancle_Friend,
        [Description("Reject friend")]
        FR04_Reject_Friend,
        [Description("UserRelationship not found")]
        UR01_NOT_FOUND,
    }
}
