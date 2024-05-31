using API.Middlewares;
using Application.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddDbContext<SE1631_DBContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Config Swagger/Open API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo()
    {
        Title = "My Api",
        Version = "1.0"
    }));
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddCors();
builder.Services.AddHealthChecks();
var app = builder.Build();


// Kích hoạt Middleware để kiểm soát loại dữ liệu làm việc trên SwaggerUI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.SerializeAsV2 = true; // Hỗ trợ tương thích ngược làm việc với JSON phiên bản 2.0
    });
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    });
}

app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AuthenMiddleware>();
app.Run();