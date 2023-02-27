FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["WebAppBoilerplate/WebAppBoilerplate.csproj", "WebAppBoilerplate/"]
RUN dotnet restore "WebAppBoilerplate/WebAppBoilerplate.csproj"
COPY . .
WORKDIR "/src/WebAppBoilerplate"

RUN dotnet build "WebAppBoilerplate.csproj" -c Release -o /app/build
# RUN dotnet tool install --global dotnet-ef
# RUN dotnet ef migrations add InitialCreate
# RUN dotnet ef database update

FROM build AS publish
RUN dotnet publish "WebAppBoilerplate.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAppBoilerplate.dll"]
