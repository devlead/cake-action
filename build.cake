var target = Argument("Target", "Successful-Task");

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
    var expect = Version.TryParse($"{EnvironmentVariable("TEST_CAKE_VERSION")}.0", out Version parsedVersion)
                    ? parsedVersion
                    : new Version(0, 34, 1, 0);

    if (expect != context.Environment.Runtime.CakeVersion)
    {
        throw new Exception($"Expected version {expect} got {context.Environment.Runtime.CakeVersion}");
    }

    Information("Successful");
});

RunTarget(target);
