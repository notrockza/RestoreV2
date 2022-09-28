
using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
    // แปลงค่า Response.Headers ให้อยู่ในรูปแบบ json ที่พร้อมใช้งานฝั่ง client
    public static class HttpExtensions
    {
           public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            //แปลงชื่อตัวแปรให้เป็นตัวเล็กตามกฏการใช้งานของ json
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
 
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}