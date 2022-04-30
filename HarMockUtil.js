import isEqual from "lodash.isequal";

export class HarMockUtil {
  static log() {
    console.log(...arguments);
  }

  static getMockResponse(req, harData) {
    const method = req.method;
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    const body = req.body;
    HarMockUtil.log("method", method);
    HarMockUtil.log("url", url);
    HarMockUtil.log("body", body);
    const mockEntry = harData.log.entries.find((entry) => {
      HarMockUtil.log("find", entry.request.method, entry.request.url);
      return (
        entry.request &&
        entry.request.method === method &&
        entry.request.url === url &&
        HarMockUtil.isDeeplyEqualPostDataHarMockAndBodyRequest(
          entry.request.postData,
          body
        )
      );
    });

    return mockEntry?.response;
  }

  static isDeeplyEqualPostDataHarMockAndBodyRequest(
    postDataHarMock,
    bodyRequest
  ) {
    HarMockUtil.log("postDataHarMock", postDataHarMock);
    HarMockUtil.log("bodyRequest", bodyRequest);

    const postDataHarMockAsObject = postDataHarMock?.text
      ? JSON.parse(postDataHarMock.text)
      : {};

    HarMockUtil.log(isEqual(postDataHarMockAsObject, bodyRequest));
    return isEqual(postDataHarMockAsObject, bodyRequest);
  }

  static getContentText(mockResponse) {
    return mockResponse?.content?.text;
  }
}
