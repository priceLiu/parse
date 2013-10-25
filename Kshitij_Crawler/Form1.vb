Public Class Form1
    Dim _sql_url As New url_webpage_manger
    Private Sub TextBox1_TextChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles _url.TextChanged
        _urlhash.Text = GetMd5Hash(_url.Text)
    End Sub

    Private Sub Form1_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        For Each state In System.Enum.GetNames(GetType(LinkState))
            _state.Items.Add(state)
        Next
        _state.SelectedIndex = 0
        For Each state In System.Enum.GetNames(GetType(LinkPriority))
            _prio.Items.Add(state)
        Next
        _prio.SelectedIndex = 0
        _load_websites()
    End Sub

    Private Sub _load_websites()
        Dim lnk() As Link
        If CheckBox1.Checked Then
            lnk = _sql_url.get_all_links(100, CheckBox2.Checked)
        Else
            lnk = _sql_url.get_all_links()
        End If
        UrlList.Items.Clear()
        For Each url As Link In lnk
            UrlList.Items.Add(url.url)
        Next
    End Sub

    Private Sub SaveAsNew_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles SaveAsNew.Click
        Try 'save url as new
            Dim lnk As New Link()
            lnk.url = _url.Text
            lnk.urlhash = _urlhash.Text
            lnk.backlink = _backlink.Value
            If RadioButton1.Checked Then
                lnk.crawldate = "sysdate()"
            Else
                lnk.crawldate = "null "
            End If
            lnk.title = TextBox2.Text
            lnk.priority = System.Enum.GetValues(GetType(LinkPriority))(_prio.SelectedIndex)
            lnk.state = System.Enum.GetValues(GetType(LinkState))(_state.SelectedIndex)
            lnk._Empty = False
            _sql_url.add_link(lnk)
            _load_websites()
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub update_ui(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles UrlList.SelectedIndexChanged
        Try ' Load url details
            Dim lnk As Link = _sql_url.get_link(func.GetMd5Hash(UrlList.SelectedItem.ToString))
            _url.Text = lnk.url
            _urlhash.Text = lnk.urlhash
            _backlink.Value = lnk.backlink
            TextBox2.Text = lnk.title
            If lnk.crawldate = "null" Then
                RadioButton2.Checked = True
            Else
                RadioButton1.Checked = True
                Label7.Text = lnk.crawldate
            End If
            _prio.SelectedIndex = System.Enum.GetValues(GetType(LinkPriority))(lnk.priority)
            _state.SelectedIndex = System.Enum.GetValues(GetType(LinkState))(lnk.state)
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        Try 'save url 
            Dim lnk As New Link()
            lnk.url = _url.Text
            lnk.urlhash = _urlhash.Text
            lnk.backlink = _backlink.Value
            If RadioButton1.Checked Then
                lnk.crawldate = "sysdate()"
            Else
                lnk.crawldate = "null "
            End If
            lnk.title = TextBox2.Text
            lnk.priority = System.Enum.GetValues(GetType(LinkPriority))(_prio.SelectedIndex)
            lnk.state = System.Enum.GetValues(GetType(LinkState))(_state.SelectedIndex)
            lnk._Empty = False
            _sql_url.update_link(lnk, func.GetMd5Hash(_url.Text))
            _load_websites()
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub Button2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button2.Click
        _load_websites()
    End Sub

    Private Sub Button3_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button3.Click
        Try
            _sql_url.remove_link(func.GetMd5Hash(UrlList.SelectedItem.ToString))
            _load_websites()
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub Button4_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button4.Click
        panda_ma.Crawl(TextBox1.Text)
    End Sub

    Dim panda_ma As New pandamanger()
    Private Sub Button5_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button5.Click
        panda_ma.self_start()
    End Sub

    Private Sub Button6_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button6.Click
        _sql_url.delete_all()
        _load_websites()
    End Sub


    Private Sub ExitToolStripMenuItem_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ExitToolStripMenuItem.Click

        Application.Exit()
    End Sub
End Class
