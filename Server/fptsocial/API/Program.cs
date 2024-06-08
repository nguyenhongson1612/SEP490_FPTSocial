﻿using API.Middlewares;
using Application.Mappers;
using Application.Services;
using Domain.Models;
using Microsoft.AspNetCore.Antiforgery;
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
builder.Services.AddControllersWithViews();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API Name", Version = "v1" });

    
    c.AddSecurityDefinition("X-XSRF-TOKEN", new OpenApiSecurityScheme
    {
        Name = "X-XSRF-TOKEN",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Description = "CSRF Token"
    });

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

app.Use((context, next) =>
{
    var requestPath = context.Request.Path.Value; 

        var tokenSet = antiforgery.GetAndStoreTokens(context);
        context.Response.Cookies.Append("XSRF-TOKEN", tokenSet.RequestToken!,
            new CookieOptions { HttpOnly = false, Secure = false, IsEssential = true, SameSite = SameSiteMode.Strict });
    return next(context);
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