using Domain.CommandModels;
using Domain.QueryModels;

namespace API.Middlewares
{
    public class AuthenMiddleware
    {
        private readonly RequestDelegate _next;
        public AuthenMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext, fptforumCommandContext context)
        {
            
            await _next(httpContext);
        }
        
    }
}
