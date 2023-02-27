using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAppBoilerplate.Auth;
using WebAppBoilerplate.Infrastructure;
using WebAppBoilerplate.Infrastructure.ServiceExtension;
using WebAppBoilerplate.Services;
using WebAppBoilerplate.Services.Interfaces;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDIServices(builder.Configuration);
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAuthentication(i =>
{
    i.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    i.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    i.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    i.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
    };
    options.Events = new JwtBearerEvents();
    options.Events.OnMessageReceived = context => {

        if (context.Request.Cookies.ContainsKey("accessToken"))
        {
            context.Token = context.Request.Cookies["accessToken"];
        }

        return Task.CompletedTask;
    };
}).AddCookie(options =>
{
    //options.Cookie.SameSite = SameSiteMode.None;
    //options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    //options.Cookie.IsEssential = true;
});

//builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => options
    .AllowAnyMethod()
    .AllowCredentials()
    //.WithHeaders("Origin", "X-Requested-With", "Content-Type", "Accept")
    //.WithExposedHeaders("set-cookie")
    .AllowAnyHeader()
    .WithOrigins("http://localhost:3000", "http://localhost:8080")
);

//app.UseMiddleware<CookieTokenMiddleware>();
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();



app.Run();
