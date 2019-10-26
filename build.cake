var target = Argument("Target", "Successful-Task");

Setup(context => {
    Information("Executing using Cake {0}", context.Environment.Runtime.CakeVersion);
});

Task("Successful-Task")
    .Does(() =>
{
    Information("Successful");
});

Task("Failing-Task")
    .Does(() =>
{
    throw new Exception("Failed");
});

Task("Version-Check-Task")
    .Does(context =>
{
    var expect = new Version(0, 34, 1, 0);
    if (expect != context.Environment.Runtime.CakeVersion)
    {
        throw new Exception($"Expected version {expect} got {context.Environment.Runtime.CakeVersion}");
    }
    Information("Successful");
});

RunTarget(target);
