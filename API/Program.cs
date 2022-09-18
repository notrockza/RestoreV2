using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

#endregion


var app = builder.Build();

#region //สร้างข้อมูลจ ำลอง Fake data
using var scope = app.Services.CreateScope(); //using หลังท ำงำนเสร็จจะถูกท ำลำยจำกMemory
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync(); //สร้ำง DB ให้อัตโนมัติถ้ำยังไม่มี
    await DbInitializer.Initialize(context); //สร้ำงข้อมูลสินค้ำจำลอง
}
catch (Exception ex)
{
    logger.LogError(ex, "Problem migrating data");
}
#endregion


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#region ส่ง error ไปให้Axios ตอนท ำ Interceptor
app.UseMiddleware<ExceptionMiddleware>(); 
#endregion

app.UseRouting();

app.UseAuthorization();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

// app.Run();

await app.RunAsync();