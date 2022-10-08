using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
   [AllowAnonymous]
    public class FallbackController : BaseApiController
    {
        //ถ้าอยากให้เป็นเหมือนเดิม // ไว้นะ
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),
                "text/HTML");
        }
    }

}