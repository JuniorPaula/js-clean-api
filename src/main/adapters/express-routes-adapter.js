const adapterRoutes = (controller) => {
  return async (req, res) => {
    const httpRequest = {
      body: req.body,
    };
    const HttpResponse = await controller.handle(httpRequest);
    res.status(HttpResponse.statusCode).json(HttpResponse.body);
  };
};

module.exports = { adapterRoutes };
