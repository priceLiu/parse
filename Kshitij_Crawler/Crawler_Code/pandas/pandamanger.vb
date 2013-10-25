Public Class pandamanger
    Private sql As New url_webpage_manger()
    '' Spider variables
    Dim Employes As New List(Of panda1)
    Dim _maxEmployes As Integer = 10
    Dim _autoStartNewWork As Boolean = True

    ''' <summary>
    ''' Crawl the given url for keywords and follow the url in the page
    ''' </summary>
    ''' <param name="link">url of the page</param>
    Public Sub Crawl(ByVal link As String)
        Dim panda As panda1 = _getSpider(True)

        ''Check if we have spider
        If panda Is Nothing Then
            Exit Sub
        End If

        Dim lnk As Link = sql.get_link(func.GetMd5Hash(link))

        If lnk._Empty Then
            '' Add the url to db and then proceed
            lnk.inset_url_with_hash(link)
            lnk.backlink = 0
            lnk.crawldate = "null"
            lnk.priority = LinkPriority.High ' Because user has requested to perform
            lnk.state = LinkState.Crawling
            lnk._Empty = False
            sql.add_link(lnk)
            sql.update_urlstate(lnk.urlhash, LinkState.Crawling)
            panda.Crawl(lnk.url)
            AddHandler panda.WorkComplete, AddressOf _TimeForNextWork
        Else
            '' Already in db check if we can crawl or not
            If lnk.state = LinkState.None Then
                '' we can crawl
                sql.update_urlstate(lnk.urlhash, LinkState.Crawling)
                panda.Crawl(lnk.url)
                AddHandler panda.WorkComplete, AddressOf _TimeForNextWork
            Else
                Dim msg As String = String.Format("{0} has a state of {1}", lnk.url, lnk.state)
                Console.WriteLine("panda_manger::crawl()->" + msg)
                MsgBox(msg)
            End If
        End If
    End Sub

    ''' <summary>
    ''' Search for an employe sitting ideal.
    ''' If no employe in office then heir one employe automatically
    ''' </summary>
    ''' <returns>Returns the ideal employe to assign him a work</returns>
    ''' <remarks></remarks>
    ''' <param name="_add_if_needed">do you need to assign a new employe if no one is there</param>
    Private Function _getSpider(ByVal _add_if_needed As Boolean) As panda1
        If Employes.Count = 0 Then
            '' We need one employe atleast at work
            Employes.Add(New panda1)
            Return Employes(0)
        Else
            For Each emp In Employes
                If Not emp.Busy Then
                    Return emp
                    Exit Function
                End If
            Next
            '' If we are here then there must be not any employe ideal.
            If _add_if_needed Then
                If Employes.Count <= _maxEmployes Then
                    Employes.Add(New panda1)
                    Return Employes(Employes.Count - 1)
                    Exit Function
                Else
                    Return Nothing
                End If
            Else
                Return Nothing
            End If
        End If
    End Function



    Private Sub _TimeForNextWork(ByVal sender As panda1, ByVal state As WorkState)
        Try
            Select Case state
                Case WorkState.Url_error, WorkState.Work_error
                    sql.update_urlstate(sender.URL_Hash, LinkState.CrawlingError)
                    Console.WriteLine("Spider got error on work complete")
                Case WorkState.Complete
                    sql.update_urlstate(sender.URL_Hash, LinkState.Crawled)
                    Console.WriteLine("Spider got work complete")
            End Select
            If _autoStartNewWork Then
                Dim lnk As Link = sql.get_work()
                If Not lnk._Empty Then
                    Console.WriteLine("Spider got new work " + lnk.url)
                    sql.update_urlstate(lnk.urlhash, LinkState.Crawling)
                    sender.Crawl(lnk.url)
                Else
                    Console.WriteLine("No work to do")
                End If
            End If
        Catch ex As Exception
        End Try
    End Sub

    Public Sub self_start()
        Try
            If _autoStartNewWork Then
                Dim lnk As Link = sql.get_work()
                If Not lnk._Empty Then
                    Console.WriteLine("Spider got new work " + lnk.url)
                    sql.update_urlstate(lnk.urlhash, LinkState.Crawling)
                    Dim panda As panda1 = _getSpider(True)
                    panda.Crawl(lnk.url)
                    AddHandler panda.WorkComplete, AddressOf _TimeForNextWork
                Else
                    Console.WriteLine("No work to do")
                End If
            End If
        Catch ex As Exception

        End Try
    End Sub
End Class
