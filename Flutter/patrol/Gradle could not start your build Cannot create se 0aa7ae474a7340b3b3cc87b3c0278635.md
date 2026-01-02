 

# Gradle could not start your build.  
> Cannot create service of type BuildTreeActionExecutor using method LauncherServices$ToolingBuildTreeScopeServices.createActionExecutor() as there is a problem with parameter #1 of type List<BuildActionRunner>.  

```Shell
ps aux | grep gradle #killして

kill -9 <ps_id>


もしくは
ps aux | grep gradle | grep -v grep | awk '{print $2}' | xargs -r kill -9
```