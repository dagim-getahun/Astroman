@echo off
for /f "tokens=1,2" %%a in ('git log --format="%ad"') do (
    echo %%a
)

exit