using API.Middlewares;
using Application.Mappers;
using Application.Services;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<fptforumContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Config Swagger/Open API

builder.Services.AddControllers(options => options.SuppressAsyncSuffixInActionNames = false)
    .AddNewtonsoftJson(x=>x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddCors();
builder.Services.AddHealthChecks();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
var app = builder.Build();


// Kích hoạt Middleware để kiểm soát loại dữ liệu làm việc trên SwaggerUI
    app.UseSwagger();
    app.UseSwaggerUI();
app.UseRouting();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AuthenMiddleware>();
app.UseEndpoints(
    endpoints => 
    { 
        endpoints.MapHealthChecks("/health");
        endpoints.MapControllers();
    });
app.Run();