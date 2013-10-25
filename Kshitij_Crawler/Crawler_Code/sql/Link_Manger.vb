Imports MySql.Data.MySqlClient

Public Class url_webpage_manger
    Inherits sql
    Protected Friend Shadows _table_name As String = "url_webpage"
    Protected Friend Shadows _table_structure = " urlhash char(32) not null unique, url varchar(250) not null unique, state int(2) not null  , crawl_date datetime ,backlink int(3) not null ,priority int(1) not null ,title varchar(500) not null"





    Public Sub New()
        MyBase.New()
        MyBase._table_name = Me._table_name
        MyBase._table_structure = Me._table_structure
        MyBase.load()
    End Sub


   
    Public Function get_all_links() As Link()
        Dim lst As New List(Of Link)
        Dim command As String = String.Format("select {0} from {1} ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name)
        Dim reader As MySqlDataReader = get_Reader(command)

        While reader.Read()
            Dim lnk As New Link()
            Try
                lnk.url = reader.GetString(0)
                lnk.urlhash = reader.GetString(1)
                lnk.state = reader.GetInt32(2)
                Try
                    lnk.crawldate = reader.GetDateTime(3).ToString()
                Catch ex As Exception
                End Try
                lnk.backlink = reader.GetInt32(5)
                lnk.priority = reader.GetInt32(6)
                Try
                    lnk.title = reader.GetString(7)
                Catch ex As Exception
                    lnk.title = String.Empty
                End Try
                lnk._Empty = False
            Catch ex As Exception
                lnk._Empty = True
            End Try
            lst.Add(lnk)
        End While
        reader.Close()
        Console.WriteLine("LinkManger::get_all_links()->total " + lst.Count.ToString + " urls retured")
        Return lst.ToArray()
    End Function

    Public Function get_all_links(ByVal limit As Integer, ByVal shortby As Boolean) As Link()
        Dim lst As New List(Of Link)
        Dim command As String
        If shortby Then
            command = String.Format("select {0} from {1} order by state,priority limit {2} ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name, limit.ToString)
        Else
            command = String.Format("select {0} from {1}  limit {2} ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name, limit.ToString)
        End If
        Dim reader As MySqlDataReader = get_Reader(command)

        While reader.Read()
            Dim lnk As New Link()
            Try
                lnk.url = reader.GetString(0)
                lnk.urlhash = reader.GetString(1)
                lnk.state = reader.GetInt32(2)
                Try
                    lnk.crawldate = reader.GetDateTime(3).ToString()
                Catch ex As Exception
                End Try
                lnk.backlink = reader.GetInt32(5)
                lnk.priority = reader.GetInt32(6)
                Try
                    lnk.title = reader.GetString(7)
                Catch ex As Exception
                    lnk.title = String.Empty
                End Try
                lnk._Empty = False
            Catch ex As Exception
                lnk._Empty = True
            End Try
            lst.Add(lnk)
        End While
        reader.Close()
        Console.WriteLine("LinkManger::get_all_links()->total " + lst.Count.ToString + " urls retured")
        Return lst.ToArray()
    End Function


    Public Sub add_link(ByVal lnk As Link)
        If Not lnk._Empty Then
            If Not BlackListed(lnk.url) Then
                Try
                    '' Check if url exist
                    Dim reader As MySqlDataReader = get_Reader(String.Format("select {0} from {1} where urlhash='{2}' ;", "url", _table_name, lnk.urlhash))
                    If reader.Read() Then
                        reader.Close()
                        '' Just increase the backlink count
                        get_Reader(String.Format("update {0} set backlink =backlink+1 where urlhash='{1}' ;", _table_name, lnk.urlhash)).Close()

                        Console.WriteLine("LinkManger::add_link()->udated backlink to ? " + lnk.backlink.ToString + " for " + lnk.ToString)
                    Else
                        reader.Close()
                        Dim command As String = "insert into {0} values('{1}','{2}',{3},{4},{5},{6},'{7}');"
                        command = String.Format(command, _table_name, lnk.urlhash, lnk.url, CInt(lnk.state), lnk.crawldate, lnk.backlink, CInt(lnk.priority), lnk.title)
                        get_Reader(command).Close()

                        Console.WriteLine("LinkManger::add_link()->sucessfull added? " + lnk.ToString())
                    End If
                Catch ex As Exception
                    Console.WriteLine("LinkManger::add_link()->error ?  " + ex.Message)
                End Try
            Else
                Console.WriteLine("LinkManger::add_link()->blacklist url ?  ")
                update_urlstate(lnk.urlhash, LinkState.BlackListed)
            End If
        Else
            Console.WriteLine("LinkManger::add_link()->rejected ? _empty")
        End If
    End Sub


    Public Shared Function BlackListed(ByVal url As String) As Boolean
        Dim lst As String() = {"http://www.i-m.co/"}
        For Each term In lst
            If url.Contains(term) Then Return True
        Next
        Return False
    End Function



    Public Sub remove_link(ByVal urlhash As String)
        Try
            If Not urlhash = "" Or Not urlhash Is Nothing Or Not urlhash = String.Empty Then
                Dim command As String = "delete from {0} where urlhash='{1}' ;"
                command = String.Format(command, _table_name, urlhash)
                get_Reader(command).Close()
            End If
        Catch ex As Exception

        End Try
    End Sub

    Public Sub update_link(ByVal lnk As Link, ByVal _urlhash As String)
        If Not lnk._Empty Then
            Try
                Dim command As String = "update {0} set url='{1}',urlhash='{2}',state={3},crawl_date={4} ,backlink={5},priority={6},title='{8}'  where urlhash='{7}' ; "
                command = String.Format(command, _table_name, lnk.url, lnk.urlhash, CInt(lnk.state), lnk.crawldate(), lnk.backlink, CInt(lnk.priority), _urlhash, lnk.title)
                get_Reader(command).Close()
                Console.WriteLine("LinkManger::update_link()->successfully {" + lnk.url + " }")
            Catch ex As Exception
                Console.WriteLine("LinkManger::update_link()->error ?  " + ex.Message)
            End Try
        Else
            Console.WriteLine("LinkManger::update_link()->rejected ? _empty")
        End If
    End Sub

    Public Sub update_title(ByVal title As String, ByVal urlhash As String)
        Try
            Dim command As String = "update {0} set title='{1}'  where urlhash='{2}' ; "
            command = String.Format(command, _table_name, title, urlhash)
            get_Reader(command).Close()
            Console.WriteLine("LinkManger::update_link()->successfully {")
        Catch ex As Exception
            Console.WriteLine("LinkManger::update_link()->error ?  " + ex.Message)
        End Try
    End Sub

    Public Sub update_urlstate(ByVal urlhash As String, ByVal st As LinkState)
        Try
            Dim command As String = "update {0} set state={1}  where urlhash='{2}' ; "
            command = String.Format(command, _table_name, CInt(st).ToString, urlhash)
            get_Reader(command).Close()
            Console.WriteLine("LinkManger::update_urlstate()->successfully {")
        Catch ex As Exception
            Console.WriteLine("LinkManger::update_urlstate()->error ?  " + ex.Message)
        End Try
    End Sub

    Public Sub delete_all()
        Try
            Dim command As String = "delete from {0}  ;"
            command = String.Format(command, _table_name)
            get_Reader(command).Close()
        Catch ex As Exception

        End Try
    End Sub

    Public Function get_link(ByVal urlhash As String) As Link
        Dim lnk As New Link
        Dim command As String = String.Format("select {0} from {1} where urlhash='{2}' ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name, urlhash)
        Dim reader As MySqlDataReader = get_Reader(command)
        lnk._Empty = True
        While reader.Read()
            Try
                lnk.url = reader.GetString(0)
                lnk.urlhash = reader.GetString(1)
                lnk.state = reader.GetInt32(2)
                Try
                    lnk.crawldate = reader.GetDateTime(3).ToString()
                Catch ex As Exception
                    lnk.crawldate = "null"
                End Try
                lnk.backlink = reader.GetInt32(4)
                lnk.priority = reader.GetInt32(5)
                lnk.title = reader.GetString(6)
                lnk._Empty = False
            Catch ex As Exception

            End Try
        End While
        reader.Close()
        Console.WriteLine("LinkManger::get_link()->sucessfull ")
        Return lnk
    End Function

    Public Function get_work() As Link
        Dim lnk As New Link
        Dim command As String = String.Format("select {0} from {1} where state=0 limit 1 ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name)
        Dim reader As MySqlDataReader = get_Reader(command)

        While reader.Read()
            Try
                lnk.url = reader.GetString(0)
                lnk.urlhash = reader.GetString(1)
                lnk.state = reader.GetInt32(2)
                Try
                    lnk.crawldate = reader.GetDateTime(3).ToString()
                Catch ex As Exception
                    lnk.crawldate = "null"
                End Try
                lnk.backlink = reader.GetInt32(4)
                lnk.priority = reader.GetInt32(5)
                lnk.title = reader.GetString(6)
                lnk._Empty = False
            Catch ex As Exception
                lnk._Empty = True
            End Try
        End While
        reader.Close()
        Console.WriteLine("LinkManger::get_link()->sucessfull ")
        Return lnk
    End Function


End Class

Public Class url_image
    Inherits sql
    Protected Friend Shadows _table_name As String = "url_image"
    Protected Friend Shadows _table_structure = " urlhash char(32) not null unique, url varchar(250) not null unique, state int(2) not null  , crawl_date datetime ,backlink int(3) not null ,priority int(1) not null ,title varchar(500) not null"


    Public Sub New()
        MyBase.New()
        MyBase._table_name = Me._table_name
        MyBase._table_structure = Me._table_structure
        MyBase.load()
    End Sub



    Public Function get_all_links() As Link()
        Dim lst As New List(Of Link)
        Dim command As String = String.Format("select {0} from {1} ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name)
        Dim reader As MySqlDataReader = get_Reader(command)

        While reader.Read()
            Dim lnk As New Link()
            Try
                lnk.url = reader.GetString(0)
                lnk.urlhash = reader.GetString(1)
                lnk.state = reader.GetInt32(2)
                Try
                    lnk.crawldate = reader.GetDateTime(3).ToString()
                Catch ex As Exception
                End Try
                lnk.backlink = reader.GetInt32(5)
                lnk.priority = reader.GetInt32(6)
                Try
                    lnk.title = reader.GetString(7)
                Catch ex As Exception
                    lnk.title = String.Empty
                End Try
                lnk._Empty = False
            Catch ex As Exception
                lnk._Empty = True
            End Try
            lst.Add(lnk)
        End While
        reader.Close()
        Console.WriteLine("LinkManger::get_all_links()->total " + lst.Count.ToString + " urls retured")
        Return lst.ToArray()
    End Function


    Public Sub add_link(ByVal lnk As Link)
        If Not lnk._Empty Then
            Try
                '' Check if url exist
                Dim reader As MySqlDataReader = get_Reader(String.Format("select {0} from {1} where urlhash='{2}' ;", "url", _table_name, lnk.urlhash))
                If reader.Read() Then
                    reader.Close()
                    '' Just increase the backlink count
                    get_Reader(String.Format("update {0} set backlink =backlink+1 where urlhash='{1}' ;", _table_name, lnk.urlhash)).Close()

                    Console.WriteLine("LinkManger::add_link()->udated backlink to ? " + lnk.backlink.ToString + " for " + lnk.ToString)
                Else
                    reader.Close()
                    Dim command As String = "insert into {0} values('{1}','{2}',{3},{4},{5},{6},'{7}');"
                    command = String.Format(command, _table_name, lnk.urlhash, lnk.url, CInt(lnk.state), lnk.crawldate, lnk.backlink, CInt(lnk.priority), lnk.title)
                    get_Reader(command).Close()

                    Console.WriteLine("LinkManger::add_link()->sucessfull added? " + lnk.ToString())
                End If
            Catch ex As Exception
                Console.WriteLine("LinkManger::add_link()->error ?  " + ex.Message)
            End Try
        Else
            Console.WriteLine("LinkManger::add_link()->rejected ? _empty")
        End If
    End Sub



    Public Sub remove_link(ByVal urlhash As String)
        If Not urlhash = "" Or Not urlhash Is Nothing Or Not urlhash = String.Empty Then
            Dim command As String = "delete from {0} where urlhash='{1}' ;"
            command = String.Format(command, _table_name, urlhash)
            get_Reader(command).Close()
        End If
    End Sub

    Public Sub update_link(ByVal lnk As Link, ByVal _urlhash As String)
        If Not lnk._Empty Then
            Try
                Dim command As String = "update {0} set url='{1}',urlhash='{2}',state={3},crawl_date={4} ,backlink={5},priority={6},title='{8}'  where urlhash='{7}' ; "
                command = String.Format(command, _table_name, lnk.url, lnk.urlhash, CInt(lnk.state), lnk.crawldate(), lnk.backlink, CInt(lnk.priority), _urlhash, lnk.title)
                get_Reader(command).Close()
                Console.WriteLine("LinkManger::update_link()->successfully {" + lnk.url + " }")
            Catch ex As Exception
                Console.WriteLine("LinkManger::update_link()->error ?  " + ex.Message)
            End Try
        Else
            Console.WriteLine("LinkManger::update_link()->rejected ? _empty")
        End If
    End Sub

    Public Sub update_title(ByVal title As String, ByVal urlhash As String)
        Try
            Dim command As String = "update {0} set title='{1}'  where urlhash='{2}' ; "
            command = String.Format(command, _table_name, title, urlhash)
            get_Reader(command).Close()
            Console.WriteLine("LinkManger::update_link()->successfully {")
        Catch ex As Exception
            Console.WriteLine("LinkManger::update_link()->error ?  " + ex.Message)
        End Try
    End Sub

    Public Function get_link(ByVal urlhash As String) As Link
        Dim lnk As New Link
        Dim command As String = String.Format("select {0} from {1} where urlhash='{2}' ;", "url,urlhash,state,crawl_date,backlink,priority,title", _table_name, urlhash)
        Dim reader As MySqlDataReader = get_Reader(command)

        While reader.Read()
            Try
                lnk.url = reader.GetString(0)
                lnk.urlhash = reader.GetString(1)
                lnk.state = reader.GetInt32(2)
                Try
                    lnk.crawldate = reader.GetDateTime(3).ToString()
                Catch ex As Exception
                    lnk.crawldate = "null"
                End Try
                lnk.backlink = reader.GetInt32(4)
                lnk.priority = reader.GetInt32(5)
                lnk.title = reader.GetString(6)
                lnk._Empty = False
            Catch ex As Exception
                lnk._Empty = True
            End Try
        End While
        reader.Close()
        Console.WriteLine("LinkManger::get_link()->sucessfull ")
        Return lnk
    End Function


End Class
