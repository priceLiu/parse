Public Structure Link
    Property url As String
    Property urlhash As String
    Property state As LinkState
    Property crawldate As String
    Property backlink As Integer
    Property priority As LinkPriority
    Property _Empty As Boolean
    Private _title As String
    Property title As String
        Get
            If _title Is Nothing Then
                Return ""
            Else
                Return _title
            End If
        End Get
        Set(ByVal value As String)
            _title = Trim(value)
        End Set
    End Property


    Public Sub inset_url_with_hash(ByVal _url As String)
        If _url.EndsWith("/") Then
            _url = _url.Substring(0, _url.LastIndexOf("/"))
        End If
        url = _url
        urlhash = GetMd5Hash(_url)
    End Sub

    Public Overrides Function Equals(ByVal obj As Object) As Boolean
        If GetType(Object) Is [GetType]() Then
            If CType(obj, Link).urlhash = urlhash Then
                Return True
            Else
                Return False
            End If
        Else
            Return False
        End If
    End Function

    Public Overrides Function ToString() As String
        Return url
    End Function

End Structure