﻿using System;
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
        [Description("Notifications Type not found")]
        NT01_Not_Found,
        [Description("You don't have any notifications")]
        N01_Not_Found,
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
        [Description("Both are not friend")]
        FR05_Not_Friend,
        [Description("You can not accept friend")]
        FR06_Can_Not_Friend,
        [Description("You can not cancel friend request")]
        FR07_Can_Not_Cancel_Friend,
        [Description("You can not reject friend request")]
        FR08_Can_Not_Reject_Friend,
        [Description("UserRelationship not found")]
        UR01_NOT_FOUND,
        [Description("ReportType is existed")]
        RT01_ReportType_Existed,
        [Description("Group role is existed")]
        GR01_Group_Role_Existed,
        [Description("Group tag is existed")]
        GR02_Group_Tag_Existed,
        [Description("Group setting is existed")]
        GR03_Group_Setting_Existed,
        [Description("Comment can't null")]
        CM01_Comment_Not_Null,
        [Description("Your comment you reply was deleted")]
        CM02_Parent_Comment_Not_Found,
        [Description("Group type is existed")]
        GR04_Group_Type_Existed,
        [Description("Group status is existed")]
        GR05_Group_Status_Existed,
        [Description("Group Name is existed")]
        GR06_Group_Name_Existed,
        [Description("Group Name is not null")]
        GR07_Group_Name_Not_Null,
        [Description("Group is not exist")]
        GR08_Group_Is_Not_Exist,
        [Description("Group post have bad word")]
        GR09_Group_Post_Have_Bad_Word,
        [Description("Your post have bad word")]
        UP01_Post_Have_Bad_Word,
        [Description("Your post not found")]
        UP02_Post_Not_Found,
    }
}
