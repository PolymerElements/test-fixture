(function (Mocha) {
  function extendInterfaceWithFixture (interfaceName) {
    var originalInterface = Mocha.interfaces[interfaceName];

    Mocha.interfaces[interfaceName] = function (suite) {
      originalInterface.apply(this, arguments);

      suite.on('pre-require', function (context, file, mocha) {
        if (!(context.afterEach || context.teardown)) {
          return;
        }

        context.fixture = function (fixtureId) {
          (context.afterEach || context.teardown)(function () {
            document
              .getElementById(fixtureId)
              .restore();
          });

          return document
            .getElementById(fixtureId)
            .create();
        };
      });
    };
  }

  Object.keys(Mocha.interfaces).forEach(extendInterfaceWithFixture);
})(this.Mocha);
