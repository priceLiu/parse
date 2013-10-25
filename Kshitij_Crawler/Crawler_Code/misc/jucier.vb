Imports System.Text
Imports HtmlAgilityPack

Public Class jucier
    Dim lst As New SortedDictionary(Of String, Integer)
    Dim Delimiters() As Char = {CType(" ", Char), CType(".", Char), _
                               CType(",", Char), CType("'", Char), _
                               Chr(10), Chr(13), "/", "\", ":", "+", "-"}
    Dim total As Integer = 0
    Dim _sql_link_webpage As New url_webpage_manger()
    Dim _sql_link_image As New url_image()
    Dim _sql_keywords_manger As New keyword_manger()
    Dim url, urlhash As String
    Dim baseuri As Uri
    Public Sub extract_juice(ByVal source As String, ByVal baseurl As String)
        Try
            url = baseurl
            urlhash = func.GetMd5Hash(url)
            baseuri = New Uri(baseurl)
            '' Extract word from visible text
            Dim doc As New HtmlAgilityPack.HtmlDocument()
            doc.LoadHtml(source)

            process_text(doc.DocumentNode)
            process_metatag(doc.DocumentNode.SelectNodes("//meta"))
            process_anchor(doc.DocumentNode.SelectNodes("//a"))
            process_image(doc.DocumentNode.SelectNodes("//img"))
            find_update_title(doc.DocumentNode.SelectNodes("//title")(0))
            save_all_words()

            'find_update_title(doc.DocumentNode.SelectNodes("//title")(0))
            Console.WriteLine(String.Format("jucier::extract_juice()->success"))
        Catch ex As Exception
            Console.WriteLine(String.Format("jucier::extract_juice()->error while jucing {0} ", ex.Message))
        End Try

    End Sub


    Public Sub process_text(ByVal node As HtmlNode)
        Try
            Dim sb As New StringBuilder()
            ExtractViewableTextHelper(sb, node)
            Dim Words() As String = sb.ToString.Split(Delimiters)
            For Each wrd As String In Words
                add_word(wrd)
            Next
            Console.WriteLine(String.Format("jucier::process_text()->success with {0} added with total frqency", lst.Count.ToString, total.ToString))
        Catch ex As Exception
            Console.WriteLine(String.Format("jucier::process_text()->error {0} ", ex.Message))
        End Try
    End Sub

    Private Sub process_metatag(ByVal htmlNodeCollection As HtmlNodeCollection)
        For Each node In htmlNodeCollection
            Try
                Select Case node.Attributes("name").Value
                    Case "keywords"
                        Dim t As String
                        t = node.Attributes("content").Value
                        rank_by_spliting(t, 45, 30)
                        Console.WriteLine(String.Format("jucier::process_metatag()->success with ( {0} )", t))
                End Select
            Catch ex As Exception
            End Try
        Next
    End Sub

    Private Sub process_heading(ByVal htmlNodeCollection As HtmlNodeCollection)
        Try
            Dim sb As New StringBuilder()
            For Each node In htmlNodeCollection
                ExtractViewableTextHelper(sb, node)
            Next
            rank_by_spliting(sb.ToString, 60, 50)
            Console.WriteLine(String.Format("jucier::process_heading()->success"))
        Catch ex As Exception
            Console.WriteLine(String.Format("jucier::process_heading()->error {0} ", ex.Message))
        End Try
    End Sub


    Private Sub process_anchor(ByVal htmlnodes As HtmlNodeCollection)
        For Each node In htmlnodes
            Try
                Dim url As String = (node.Attributes("href").Value)
                Relative_url(url)
                sanitize_link(url)
                Select Case url_type(url)
                    Case URL_Protocol.http, URL_Protocol.https
                        Dim lnk As New Link
                        lnk.inset_url_with_hash(url)
                        lnk.crawldate = "null"
                        lnk.priority = LinkPriority.Low
                        lnk.state = LinkState.None
                        lnk._Empty = False
                        _sql_link_webpage.add_link(lnk)
                End Select
            Catch ex As Exception
            End Try
        Next
    End Sub

    Private Sub process_image(ByVal htmlnodes As HtmlNodeCollection)
        For Each node In htmlnodes
            Try
                Dim url As String = (node.Attributes("src").Value)
                Relative_url(url)
                sanitize_link(url) 'by removing internal linking
                Select Case url_type(url)
                    Case URL_Protocol.http, URL_Protocol.https
                        Dim lnk As New Link
                        lnk.inset_url_with_hash(url)
                        lnk.crawldate = "null"
                        lnk.priority = LinkPriority.Low
                        lnk.state = LinkState.None
                        lnk._Empty = False
                        _sql_link_image.add_link(lnk)
                End Select
            Catch ex As Exception
            End Try
        Next
    End Sub

  


    Public Sub Relative_url(ByRef relative As String)
        Dim rel As New Uri(baseuri, relative)
        relative = rel.Scheme + Uri.SchemeDelimiter + rel.Host + rel.PathAndQuery
    End Sub

    Private Sub ExtractViewableTextHelper(ByVal sb As StringBuilder, ByVal node As HtmlNode)
        If node.Name <> "script" AndAlso node.Name <> "style" Then
            If node.NodeType = HtmlNodeType.Text Then
                AppendNodeText(sb, node)
            End If

            For Each child As HtmlNode In node.ChildNodes
                ExtractViewableTextHelper(sb, child)
            Next
        End If
    End Sub

    Private Sub AppendNodeText(ByVal sb As StringBuilder, ByVal node As HtmlNode)
        Dim text As String = DirectCast(node, HtmlTextNode).Text
        If String.IsNullOrEmpty(text) = False Then
            sb.Append(text)
            If text.EndsWith(vbTab) OrElse text.EndsWith(vbLf) OrElse text.EndsWith(" ") OrElse text.EndsWith(vbCr) Then
            Else
                sb.Append(" ")
            End If
        End If
    End Sub

    

    ''' <summary>
    ''' Increase the rank of word in the list
    ''' </summary>
    ''' <param name="wrd">word</param>
    ''' <param name="rank1">if the word exist in %</param>
    ''' <param name="rank2">if the word does not exists in %</param>
    ''' <remarks></remarks>
    Private Sub rankword(ByVal wrd As String, ByVal rank1 As Integer, ByVal rank2 As Integer)
        Try
            If lst.ContainsKey(wrd) Then
                lst(wrd) += ((rank1 / total) * 100) 'rank1 is per inc in word
                Console.WriteLine(String.Format("jucier::rankword()->rank inc^ : {0} .new rank {1}", wrd, lst(wrd).ToString))
            Else
                add_word(wrd, ((rank2 / total) * 100))
                Console.WriteLine(String.Format("jucier::rankword()->new word : {0} ", wrd))

            End If
        Catch ex As Exception
        End Try
    End Sub


    ''' <summary>
    ''' 
    ''' </summary>
    ''' <param name="wrd"></param>
    ''' <param name="rank1">in %</param>
    ''' <param name="rank2">in %</param>
    ''' <remarks></remarks>
    Private Sub rank_by_spliting(ByVal wrd As String, ByVal rank1 As Integer, ByVal rank2 As Integer)
        Try
            Dim words() As String = wrd.Split(Delimiters)
            For Each wr In words
                rankword(wr, rank1, rank2)
            Next
        Catch ex As Exception

        End Try
    End Sub

    ''' <summary>
    ''' Just add the word to the shorted list and if exist incresae its frquenct by 1.
    ''' </summary>
    ''' <param name="wrd"></param>
    ''' <remarks></remarks>
    Private Sub add_word(ByVal wrd As String, Optional ByVal frquency As Integer = 1)
        Try
            If lst.ContainsKey(wrd) Then
                lst(wrd) += frquency
                Console.WriteLine(String.Format("jucier::add_word()->= word : {0} rank ^ {1}", wrd, lst(wrd).ToString))
            Else
                If IsValidWord(Trim(wrd).ToLower) Then
                    lst.Add(Trim(wrd).ToLower, frquency)
                    Console.WriteLine(String.Format("jucier::add_word()->new word : {0} ", wrd))
                End If
            End If
            total += 1
        Catch ex As Exception

        End Try
    End Sub

    Protected Function IsValidWord(ByVal word As String) As Boolean
        If word = "" Then
            Return (False)
        End If
        Dim ch As Char
        For iChar = 0 To Len(word) - 1
            ch = word.Chars(iChar)
            If ch > "a" And ch < "z" Then
                Return (False)
            End If
        Next
        Return (True)
    End Function

    Private Sub save_all_words()
        For Each wrd In lst
            _sql_keywords_manger.add_word(wrd.Key, urlhash, wrd.Value, (wrd.Value / total) * 100)
        Next
    End Sub

    Private Sub find_update_title(ByVal htmlNode As HtmlNode)
        Try
            _sql_link_webpage.update_title(htmlNode.InnerText, urlhash)
            rank_by_spliting(htmlNode.InnerText, 50, 30)
        Catch ex As Exception
            Console.WriteLine(String.Format("jucier::find_update_title()->error url:{1} >> {0} ", ex.Message, url))
        End Try
    End Sub
End Class
