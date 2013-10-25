Imports MySql.Data.MySqlClient

Public Class keyword_manger

    Protected Friend Shadows _table_name As String = "keyword_list"
    Protected Friend Shadows _table_structure = " word varchar(100) not null ,urlhash char(32) not null ,freq int(3) not null, per_in_site int(3) not null "

    Protected Friend Shadows _table_index_name As String = "keyword_index"
    Protected Friend Shadows _table_index_structure = " word varchar(100) not null unique , freq int(3) not null  "

    Protected Friend conn As MySqlConnection
    Protected Friend data As DataTable
    Protected Friend da As MySqlDataAdapter
    Protected Friend cb As MySqlCommandBuilder

    Protected Friend _database As String = "crawler"
    Protected Friend _host As String = "localhost"
    Protected Friend _username As String = "root"
    Protected Friend _password As String = "root"

    Protected Sub create_connection()
        Dim connStr As String
        connStr = String.Format("server={0};user id={1}; password={2}; database=mysql; pooling=false", _host, _username, _password)
        conn = New MySqlConnection(connStr)
        conn.Open()
        Console.WriteLine("LinkManger::create_connection()->successfull")
    End Sub

    Protected Function get_Reader(ByVal command As String) As MySqlDataReader
        Dim reader As MySqlDataReader
        Dim cmd As New MySqlCommand(command, conn)
        reader = cmd.ExecuteReader()
        Return reader
    End Function

    Protected Function _db_exits(ByVal name As String) As Boolean
        Dim reader As MySqlDataReader = get_Reader("show databases;")
        Dim _dbexit As Boolean = False
        While reader.Read()
            Try
                If name = reader.GetString(0) Then
                    _dbexit = True
                    Exit While
                End If
            Catch ex As Exception
            End Try
        End While
        reader.Close()
        Return _dbexit
    End Function

    Protected Function _table_exists(ByVal name As String) As Boolean
        Dim reader As MySqlDataReader = get_Reader("show tables;")
        Dim _table As Boolean = False
        While reader.Read()
            If name = reader.GetString(0) Then
                _table = True
                Exit While
            End If
        End While
        reader.Close()
        Return _table
    End Function

    Protected Sub create_database(ByVal name As String)
        get_Reader(String.Format("create database {0} ;", name)).Close()
        Console.WriteLine("LinkManger::create_database()->sucessfull ? name= " + name)
    End Sub

    Protected Sub create_table(ByVal name As String, ByVal str As String)
        get_Reader(String.Format("create table {0} ({1}) ;", name, str)).Close()
        Console.WriteLine("LinkManger::create_table()->sucessfull ? name= " + name.PadRight(5) + str)
    End Sub


    Private Sub create_enviroment()
        If _db_exits(_database) Then
            conn.ChangeDatabase(_database)
            If Not _table_exists(_table_name) Then
                create_table(_table_name, _table_structure)
            End If
            If Not _table_exists(_table_index_name) Then
                create_table(_table_index_name, _table_index_structure)
            End If
        Else
            create_database(_database)
            conn.ChangeDatabase(_database)
            create_table(_table_name, _table_structure)
            create_table(_table_index_name, _table_index_structure)
        End If
    End Sub

    Protected Sub load()
        create_connection()
        create_enviroment()
    End Sub
    Public Sub New()
        load()
    End Sub


    Public Sub add_word(ByVal wrd As String, ByVal urlhash As String, ByVal freq As Integer, ByVal per As Integer)
        Try
            Dim reader As MySqlDataReader = get_Reader(String.Format("select {0} from {1} where word='{2}' ;", "word", _table_index_name, wrd))
            If reader.Read() Then
                reader.Close()
                '' Already in index_list
                get_Reader(String.Format("update {0} set freq=freq+1 where word='{1}' ;", _table_index_name, wrd)).Close()
                Console.WriteLine(String.Format("keyword_manger::addword()->word+ {0} ", wrd))
            Else
                reader.Close()
                '' Add to index_list
                get_Reader(String.Format("insert into {0} values('{1}',{2});", _table_index_name, wrd, freq.ToString)).Close()
                Console.WriteLine(String.Format("keyword_manger::addword()->word* {0} .", wrd))
            End If


            ''''
            'For raw list table
            ''''
            get_Reader(String.Format("insert into {0} values('{1}','{2}', {3} ,{4});", _table_name, wrd, urlhash, freq.ToString, per.ToString)).Close()

        Catch ex As Exception
            Console.WriteLine(String.Format("keyword_manger::addword()->error while inserting {0} >> {1}", wrd, ex.Message))
        End Try
    End Sub
End Class
