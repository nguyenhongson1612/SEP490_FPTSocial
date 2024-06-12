using API.Middlewares;
using Application.Mappers;
using Application.Services;
using Domain.CommandModels;
using Domain.QueryModels;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<fptforumQueryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("QureryConnection")));
builder.Services.AddDbContext<fptforumCommandContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CommandConnection")));
// Config Swagger/Open API

builder.Services.AddControllers(options => options.SuppressAsyncSuffixInActionNames = false)
    .AddNewtonsoftJson(x=>x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddCors();
builder.Services.AddHealthChecks();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
builder.Services.AddControllersWithViews();
builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

   c.OperationFilter<AddXsrfTokenHeaderParameter>();
});
var app = builder.Build();


// Kích hoạt Middleware để kiểm soát loại dữ liệu làm việc trên SwaggerUI
app.UseSwagger();
app.UseSwaggerUI();
app.UseRouting();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
}
var antiforgery = app.Services.GetRequiredService<IAntiforgery>();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;
    string[] urlPaths = { "/api", "/swagger" };

    if (urlPaths.Any(urlPath => path.StartsWith(urlPath)))
    {
        var tokens = antiforgery.GetAndStoreTokens(context);
        context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken,
            new CookieOptions() { HttpOnly = false, Secure = false, IsEssential = true, SameSite = SameSiteMode.Strict });
    }

    await next(); 
});


app.UseStaticFiles();
app.UseRouting();
app.UseHttpsRedirection();
app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AuthenMiddleware>();
app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});
app.UseEndpoints(
    endpoints => 
    { 
        endpoints.MapHealthChecks("/health");
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action}/{id?}");
        endpoints.MapControllers();
    });
app.Run();