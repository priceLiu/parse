Public Class panda1
    Inherits Ipanda

    Public Event Notice(ByVal msg As String, ByVal sender As panda1)
    Public Event WorkComplete(ByVal sender As panda1, ByVal state As WorkState)
    Public Overrides Sub Crawl(ByVal link As String)
        sanitize_link(link)
        ' url_webpage_manger.BlackListed(link)
       
        If Not Busy Then
            _url = link
            _urlhash = func.GetMd5Hash(link)
            _working = True
            Dim t As New Task(AddressOf _process)
            t.BeginInvoke(Nothing, Nothing)
        End If
    End Sub



    Private Function IsValidUrl(ByVal url As String) As Boolean
        If url.StartsWith("http://") Then
            speak(String.Format("panda1::IsValidUrl()true[ {0} ]", url))
            Return True
        ElseIf url.Contains("#") Then 'i hate internal linking it cause to much problem
            speak(String.Format("panda1::IsValidUrl()false[ {0} ]", url))
            Return False
        Else
            speak(String.Format("panda1::IsValidUrl()false[ {0} ]", url))
            Return False
        End If
    End Function

    Private Sub _process()
        Try
            Select Case url_type(URL)
                Case URL_Protocol.http
                    If Not url_webpage_manger.BlackListed(URL) Then
                        speak(String.Format("panda1::_process()->waiting for source {0}", URL))
                        Dim source As String = func.get_SouceCode(URL)
                        If String.IsNullOrEmpty(source) Then
                            _working = False
                            speak(String.Format("panda1::_process()->return empty source code"))
                            RaiseEvent WorkComplete(Me, WorkState.Url_error)
                        Else
                            Dim juice As New jucier()
                            juice.extract_juice(source, URL) 'will also update paage title
                            _working = False
                            speak(String.Format("panda1::_process()->work completed for {0}", URL))
                            RaiseEvent WorkComplete(Me, WorkState.Complete)
                        End If
                    Else
                        Throw New Exception()
                    End If
                Case Else
                    Throw New Exception()
            End Select

        Catch ex As Exception
            speak(String.Format("panda1::_process()->error >>  {0} ", ex.Message))
            _working = False
            RaiseEvent WorkComplete(Me, WorkState.Work_error)
        End Try

    End Sub


End Class