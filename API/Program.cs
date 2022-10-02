using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

#region Swagger Config
builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Jwt auth header",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
        });
    });
#endregion

builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

#region Cors
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials()
                          .WithOrigins("http://localhost:3000");
                      });
});
//AllowCredentials() อนุญาตให้ client ใช้คุกกี้ของ Api ได้
#endregion

#region Identityสร้างเซอร์วิส User,Role (ระวังการเรียงลำดับ)
builder.Services.AddIdentityCore<User>(opt =>
{
    // จะกำหนด option อะไรบ้าง
    opt.User.RequireUniqueEmail = true;
})
    //อย่าลืมเเก้ด้วยนะ
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();
#endregion

#region Identityสร้างเซอร์วิส User,Role (ระวังการเรียงลำดับ)
builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})  
    //อย่าลืมเเก้ด้วยนะ
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();

//ยืนยัน Token ที่ได้รับว่าถูกต้องหรือไม่บนเซิฟเวอร์
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                       .AddJwtBearer(opt =>
                       {
                           opt.TokenValidationParameters = new TokenValidationParameters
                           {
                               ValidateIssuer = false,
                               ValidateAudience = false,
                               ValidateLifetime = true,
                               ValidateIssuerSigningKey = true,
                               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                                   .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
                           };
                       });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
#endregion

var app = builder.Build();

#region //สร้างข้อมูลจ ำลอง Fake data
using var scope = app.Services.CreateScope(); //using หลังท ำงำนเสร็จจะถูกท ำลำยจำกMemory
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync(); //สร้ำง DB ให้อัตโนมัติถ้ำยังไม่มี //ข้อดีที่ต้องใช่
    await DbInitializer.Initialize(context, userManager); //สร้างข้อมูลสินค้าและยูเซอร์จำลอง
}
catch (Exception ex)
{
    logger.LogError(ex, "Problem migrating data");
}
#endregion


// Configure the HTTP request pipeline.

    app.UseSwagger();
    app.UseSwaggerUI();


#region ส่ง error ไปให้Axios ตอนท ำ Interceptor
app.UseMiddleware<ExceptionMiddleware>(); 
#endregion

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

//ต้องใส่ตามเเบบนี้นะ ไม่งั้นไม่ออก //ดูดีๆ
app.UseAuthentication();
//ส่งตั๋วออกไป
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();