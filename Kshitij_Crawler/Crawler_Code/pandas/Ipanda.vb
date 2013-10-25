Public MustInherit Class Ipanda
    Public MustOverride Sub Crawl(ByVal url As String)

    Protected Delegate Sub Task()
    Protected _working As Boolean
    Protected _url, _urlhash As String
    Public ReadOnly Property Busy As Boolean
        Get
            Return _working
        End Get
    End Property

    Public ReadOnly Property URL As String
        Get
            Return _url
        End Get
    End Property

    Public ReadOnly Property URL_Hash As String
        Get
            Return _urlhash
        End Get
    End Property

    Protected Sub speak(ByVal msg As String)
        Console.WriteLine(msg)
    End Sub
End Class
