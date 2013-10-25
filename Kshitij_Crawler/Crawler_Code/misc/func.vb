Imports System.Security.Cryptography
Imports System.Text
Imports System.Net

Public Module func
    Public Function GetMd5Hash(ByVal input As String) As String
        Dim md5hash As MD5 = MD5.Create()
        ' Convert the input string to a byte array and compute the hash. 
        Dim data As Byte() = md5hash.ComputeHash(Encoding.UTF8.GetBytes(input))
        ' Create a new Stringbuilder to collect the bytes 
        ' and create a string. 
        Dim sBuilder As New StringBuilder()
        ' Loop through each byte of the hashed data  
        ' and format each one as a hexadecimal string. 
        Dim i As Integer
        For i = 0 To data.Length - 1
            sBuilder.Append(data(i).ToString("x2"))
        Next i
        ' Return the hexadecimal string. 
        Return sBuilder.ToString()
    End Function

    ' Get the source code of any website
    Public Function get_SouceCode(ByVal url As String) As String
        Try
            ' Create the request using the WebRequestFactory.
            Dim requestScrape As HttpWebRequest = CType(WebRequest.Create(url), HttpWebRequest)
            Dim responseScrape As HttpWebResponse = Nothing
            With requestScrape
                .UserAgent = "Kshitij Crawler"
                .Method = "GET"
                .Timeout = 10000
            End With
            ' Return the response stream.
            Console.WriteLine(String.Format("get_SouceCode::->Waiting for source code {0} ", url))
            responseScrape = CType(requestScrape.GetResponse(), HttpWebResponse)
            Dim sr As IO.StreamReader = New IO.StreamReader(responseScrape.GetResponseStream())
            Dim str As String = sr.ReadToEnd()
            sr.Dispose()
            sr = Nothing
            responseScrape.Close()
            If responseScrape.StatusCode = HttpStatusCode.OK Then
                Return str
            Else
                Return String.Empty
            End If
        Catch ex As Exception
            Console.WriteLine(String.Format("get_SouceCode::->error with {0} >> {1} ", url, ex.Message))
            Return String.Empty
        End Try
    End Function

    Public Function url_type(ByVal url As String) As URL_Protocol
        If (url.Contains("#")) Then 'simply i hate internal linking bcz it cause a lot of prblm
            Return URL_Protocol.none
        ElseIf url.StartsWith("https://") Then
            Return URL_Protocol.https
        ElseIf url.StartsWith("http://") Then
            Return URL_Protocol.http
        Else
            Return URL_Protocol.none
        End If
    End Function

    Public Sub sanitize_link(ByRef url As String)
        If url.Contains("#") Then
            url = url.Substring(0, url.IndexOf("#"))
        End If
    End Sub
End Module