using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    //สร้างมาจาก Identity Framework
    // primary key เป็นข้อมูล string
    public class User : IdentityUser <int>
    {
       //จะสร้างตาราง UserAddress ให้เองอัตโนมัติ
       public UserAddress Address {get; set;}
    }
}