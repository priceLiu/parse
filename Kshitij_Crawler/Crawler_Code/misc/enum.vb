Public Enum LinkState
    None = 0
    Crawling = 1
    Crawled = 2
    NotFound = 3
    CrawlingError = 4
    NotToCrawl = 5
    BlackListed = 6
End Enum

Public Enum LinkPriority
    Low = 0
    Medium = 1
    High = 2
End Enum

Public Enum WorkState
    Complete = 0
    Url_error = 1
    Work_error = 3
End Enum

Public Enum URL_Protocol
    none = 0
    http = 1
    https = 2
    ftp = 3
    ftps = 4
    mailto = 5
    javascript = 6
End Enum