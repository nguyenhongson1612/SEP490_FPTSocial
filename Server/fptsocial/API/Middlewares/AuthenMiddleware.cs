using Domain.Models;

namespace API.Middlewares
{
    public class AuthenMiddleware
    {
        private readonly RequestDelegate _next;
        public AuthenMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext, fptforumContext context)
        {
            
            await _next(httpContext);
        }
    }
}
