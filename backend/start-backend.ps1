$ErrorActionPreference = "Stop"

$jdkDir = "$PSScriptRoot\jdk-21.0.2"

if (-Not (Test-Path $jdkDir)) {
    Write-Host "Downloading JDK 21..."
    Invoke-WebRequest -Uri "https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_windows-x64_bin.zip" -OutFile "jdk-21.zip"
    Write-Host "Extracting JDK 21..."
    Expand-Archive "jdk-21.zip" -DestinationPath $PSScriptRoot -Force
    Remove-Item "jdk-21.zip"
}

Write-Host "Setting JAVA_HOME to $jdkDir"
$env:JAVA_HOME = $jdkDir
$env:PATH = "$jdkDir\bin;" + $env:PATH

Write-Host "Running Spring Boot..."
mvn clean spring-boot:run
