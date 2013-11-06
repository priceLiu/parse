<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm3.aspx.cs" Inherits="MySpider.Web.WebForm3" %>

<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Ajaxify | Just another demo Sites site</title>
 <!--   <link rel="profile" href="http://gmpg.org/xfn/11" />
    <link rel="pingback" href="http://demo.fabthemes.com/ajaxify/xmlrpc.php" /> -->

    <link href='http://fonts.googleapis.com/css?family=Bitter:400,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Lato:400,300,700,900' rel='stylesheet' type='text/css'>

    <!--[if lt IE 9]>
<script src="http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/js/html5.js" type="text/javascript"></script>
<![endif]-->

   <!-- <link rel="alternate" type="application/rss+xml" title="Ajaxify &raquo; Feed" href="http://demo.fabthemes.com/ajaxify/feed/" />
    <link rel="alternate" type="application/rss+xml" title="Ajaxify &raquo; Comments Feed" href="http://demo.fabthemes.com/ajaxify/comments/feed/" />   -->
    <link rel='stylesheet' id='style-css' href='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/style.css?ver=3.6.1' type='text/css' media='all' />
    <link rel='stylesheet' id='grid-css' href='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/css/grid.css?ver=3.6.1' type='text/css' media='all' />
    <link rel='stylesheet' id='theme-css' href='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/css/theme.css?ver=3.6.1' type='text/css' media='all' />
    <link rel='stylesheet' id='cart66-css-css' href='http://cdn.demo.fabthemes.com/ajaxify/wp-content/plugins/cart66-lite/cart66.css?ver=1.5.1.15' type='text/css' media='all' />
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-includes/js/jquery/jquery.js?ver=1.10.2'></script>
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.2.1'></script>
    
    <!--
    <link rel="EditURI" type="application/rsd+xml" title="RSD" href="http://demo.fabthemes.com/ajaxify/xmlrpc.php?rsd" /> -->
    
    
    <link rel="wlwmanifest" type="application/wlwmanifest+xml" href="http://cdn.demo.fabthemes.com/ajaxify/wp-includes/wlwmanifest.xml" />
    <meta name="generator" content="WordPress 3.6.1" />
    <style type="text/css">
        .recentcomments a {
            display: inline !important;
            padding: 0 !important;
            margin: 0 !important;
        }
    </style>
    <meta name="generator" content="Cart66 Lite 1.5.1.15" />
</head>

<body class="home blog">
    <div id="outer" class="cf">
        <div id="page" class="hfeed site container_8">

            <header id="masthead" class="site-header cf" role="banner">

                <div class="logo grid_2">
                    <h1 class="site-title"><a href="http://demo.fabthemes.com/ajaxify/" title="Ajaxify" rel="home">Ajaxify</a></h1>
                </div>
                <form method="get" id="searchform" action="http://demo.fabthemes.com/ajaxify/" role="search">
                    <label for="s" class="assistive-text">Search</label>
                    <input type="text" class="field" name="s" value="" id="s" placeholder="Search &hellip;" />
                    <input type="submit" class="submit" name="submit" id="searchsubmit" value="" />
                </form>
                <div class="grid_6">
                    <div class="topnavi clearfix">
                        <div id="submenu" class="menu-primary-container">
                            <ul id="web2feel" class="sfmenu">
                                <li id="menu-item-72" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-72"><a href="http://demo.fabthemes.com/ajaxify/category/finance/">Finance</a></li>
                                <li id="menu-item-73" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-73"><a href="http://demo.fabthemes.com/ajaxify/category/religion/">Religion</a></li>
                                <li id="menu-item-74" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-74"><a href="http://demo.fabthemes.com/ajaxify/category/sports/">Sports</a></li>
                                <li id="menu-item-75" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-75"><a href="http://demo.fabthemes.com/ajaxify/category/business/">Business</a>
                                    <ul class="sub-menu">
                                        <li id="menu-item-77" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-77"><a href="http://demo.fabthemes.com/ajaxify/category/aciform/">Aciform</a></li>
                                        <li id="menu-item-78" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-78"><a href="http://demo.fabthemes.com/ajaxify/category/asmodeus/">Asmodeus</a></li>
                                    </ul>
                                </li>
                                <li id="menu-item-76" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-76"><a href="http://demo.fabthemes.com/ajaxify/category/politics/">Politics</a></li>
                                <li id="menu-item-79" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-79"><a href="http://demo.fabthemes.com/ajaxify/category/entertainment/">Entertainment</a>
                                    <ul class="sub-menu">
                                        <li id="menu-item-81" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-81"><a href="http://demo.fabthemes.com/ajaxify/category/art/">Art</a></li>
                                        <li id="menu-item-80" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-80"><a href="http://demo.fabthemes.com/ajaxify/category/vintage/">Vintage</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


            </header>
            <!-- #masthead .site-header -->

            <div id="main" class="site-main cf">
                <div id="primary" class="content-area grid_6">
                    <div id="content" class="site-content cf" role="main">





                        <article id="post-70" class="post-70 post type-post status-publish format-standard hentry category-arrangement category-art category-business cf">
                            <div class="leftbox">
                                <div class="datebox">
                                    <div class="ddate">10</div>
                                    <div class="dmonth">June</div>
                                </div>
                                <div class="post-author">
                                    Posted by <a href="http://demo.fabthemes.com/ajaxify/author/admin/" title="Posts by admin" rel="author">admin</a>
                                </div>
                                <div class="post-comments">
                                    <a href="http://demo.fabthemes.com/ajaxify/2012/06/10/praesent-sapien-velit/#respond" title="Comment on Praesent sapien velit">0 Comments</a>
                                </div>
                                <div class="post-cats">
                                    Posted in <a href="http://demo.fabthemes.com/ajaxify/category/arrangement/" title="View all posts in Arrangement" rel="category tag">Arrangement</a>, <a href="http://demo.fabthemes.com/ajaxify/category/art/" title="View all posts in Art" rel="category tag">Art</a>, <a href="http://demo.fabthemes.com/ajaxify/category/business/" title="View all posts in Business" rel="category tag">Business</a>
                                </div>
                            </div>
                            <div class="rightbox">

                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/10/praesent-sapien-velit/">
                                    <img class="postimg" src="http://cdn.demo.fabthemes.com/ajaxify/files/2012/06/Untitled-1-540x300.jpg" /></a>


                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="http://demo.fabthemes.com/ajaxify/2012/06/10/praesent-sapien-velit/" title="Permalink to Praesent sapien velit" rel="bookmark">Praesent sapien velit</a></h1>
                                </header>
                                <!-- .entry-header -->

                                <div class="entry-summary">
                                    <p>Maecenas imperdiet, ligula et mattis feugiat, elit felis fringilla purus, eu pretium quam justo ac orci. Nunc congue, enim sit amet dignissim malesuada, metus purus aliquet nibh, non euismod urna urna ac libero. Aenean congue enim fringilla elit vulputate ut ornare massa aliquam. Mauris pellentesque odio et justo vehicula ullamcorper. Aliquam laoreet placerat massa vel [&hellip;]</p>
                                </div>
                                <!-- .entry-summary -->


                            </div>

                        </article>
                        <!-- #post-70 -->



                        <article id="post-53" class="post-53 post type-post status-publish format-standard hentry category-art category-business category-finance category-religion cf">
                            <div class="leftbox">
                                <div class="datebox">
                                    <div class="ddate">9</div>
                                    <div class="dmonth">June</div>
                                </div>
                                <div class="post-author">
                                    Posted by <a href="http://demo.fabthemes.com/ajaxify/author/admin/" title="Posts by admin" rel="author">admin</a>
                                </div>
                                <div class="post-comments">
                                    <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/aenean-velit-risus-venenatis-sed-pellentesque-ege/#comments" title="Comment on Aenean velit risus, venenatis sed pellentesque ege">1 Comment</a>
                                </div>
                                <div class="post-cats">
                                    Posted in <a href="http://demo.fabthemes.com/ajaxify/category/art/" title="View all posts in Art" rel="category tag">Art</a>, <a href="http://demo.fabthemes.com/ajaxify/category/business/" title="View all posts in Business" rel="category tag">Business</a>, <a href="http://demo.fabthemes.com/ajaxify/category/finance/" title="View all posts in Finance" rel="category tag">Finance</a>, <a href="http://demo.fabthemes.com/ajaxify/category/religion/" title="View all posts in Religion" rel="category tag">Religion</a>
                                </div>
                            </div>
                            <div class="rightbox">

                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/aenean-velit-risus-venenatis-sed-pellentesque-ege/">
                                    <img class="postimg" src="http://cdn.demo.fabthemes.com/ajaxify/files/2012/06/p9-540x300.jpg" /></a>


                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="http://demo.fabthemes.com/ajaxify/2012/06/09/aenean-velit-risus-venenatis-sed-pellentesque-ege/" title="Permalink to Aenean velit risus, venenatis sed pellentesque ege" rel="bookmark">Aenean velit risus, venenatis sed pellentesque ege</a></h1>
                                </header>
                                <!-- .entry-header -->

                                <div class="entry-summary">
                                    <p>Ut sit amet odio erat, ut rhoncus libero. Maecenas vestibulum dui et urna fringilla pulvinar at ornare nibh. Nam et scelerisque lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam quis neque et elit congue luctus. Sed ultrices tellus at dui pellentesque vulputate? Phasellus molestie tincidunt convallis. Nullam turpis [&hellip;]</p>
                                </div>
                                <!-- .entry-summary -->


                            </div>

                        </article>
                        <!-- #post-53 -->



                        <article id="post-51" class="post-51 post type-post status-publish format-standard hentry category-finance category-politics category-religion cf">
                            <div class="leftbox">
                                <div class="datebox">
                                    <div class="ddate">9</div>
                                    <div class="dmonth">June</div>
                                </div>
                                <div class="post-author">
                                    Posted by <a href="http://demo.fabthemes.com/ajaxify/author/admin/" title="Posts by admin" rel="author">admin</a>
                                </div>
                                <div class="post-comments">
                                    <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/phasellus-justo-quam-commodo-sit-amet-pharetra/#comments" title="Comment on Phasellus justo quam, commodo sit amet pharetra">1 Comment</a>
                                </div>
                                <div class="post-cats">
                                    Posted in <a href="http://demo.fabthemes.com/ajaxify/category/finance/" title="View all posts in Finance" rel="category tag">Finance</a>, <a href="http://demo.fabthemes.com/ajaxify/category/politics/" title="View all posts in Politics" rel="category tag">Politics</a>, <a href="http://demo.fabthemes.com/ajaxify/category/religion/" title="View all posts in Religion" rel="category tag">Religion</a>
                                </div>
                            </div>
                            <div class="rightbox">

                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/phasellus-justo-quam-commodo-sit-amet-pharetra/">
                                    <img class="postimg" src="http://cdn.demo.fabthemes.com/ajaxify/files/2012/06/p8-540x300.jpg" /></a>


                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="http://demo.fabthemes.com/ajaxify/2012/06/09/phasellus-justo-quam-commodo-sit-amet-pharetra/" title="Permalink to Phasellus justo quam, commodo sit amet pharetra" rel="bookmark">Phasellus justo quam, commodo sit amet pharetra</a></h1>
                                </header>
                                <!-- .entry-header -->

                                <div class="entry-summary">
                                    <p>In sodales magna nec leo sodales fringilla. Vivamus ante orci, pharetra vel interdum facilisis, lobortis a massa. Sed libero felis, tristique quis scelerisque et, semper at mauris. Maecenas arcu ante, porta eget imperdiet in, dictum non lectus. Suspendisse potenti. Proin a turpis est. Vivamus in lectus nec eros cursus luctus non sit amet diam. Aliquam [&hellip;]</p>
                                </div>
                                <!-- .entry-summary -->


                            </div>

                        </article>
                        <!-- #post-51 -->



                        <article id="post-49" class="post-49 post type-post status-publish format-standard hentry category-aciform category-finance category-sports category-vintage cf">
                            <div class="leftbox">
                                <div class="datebox">
                                    <div class="ddate">9</div>
                                    <div class="dmonth">June</div>
                                </div>
                                <div class="post-author">
                                    Posted by <a href="http://demo.fabthemes.com/ajaxify/author/admin/" title="Posts by admin" rel="author">admin</a>
                                </div>
                                <div class="post-comments">
                                    <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/cras-ullamcorper-imperdiet-sapien-semper-ultrices/#comments" title="Comment on Cras ullamcorper imperdiet sapien semper ultrices">1 Comment</a>
                                </div>
                                <div class="post-cats">
                                    Posted in <a href="http://demo.fabthemes.com/ajaxify/category/aciform/" title="View all posts in Aciform" rel="category tag">Aciform</a>, <a href="http://demo.fabthemes.com/ajaxify/category/finance/" title="View all posts in Finance" rel="category tag">Finance</a>, <a href="http://demo.fabthemes.com/ajaxify/category/sports/" title="View all posts in Sports" rel="category tag">Sports</a>, <a href="http://demo.fabthemes.com/ajaxify/category/vintage/" title="View all posts in Vintage" rel="category tag">Vintage</a>
                                </div>
                            </div>
                            <div class="rightbox">

                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/cras-ullamcorper-imperdiet-sapien-semper-ultrices/">
                                    <img class="postimg" src="http://cdn.demo.fabthemes.com/ajaxify/files/2012/06/p7-540x300.jpg" /></a>


                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="http://demo.fabthemes.com/ajaxify/2012/06/09/cras-ullamcorper-imperdiet-sapien-semper-ultrices/" title="Permalink to Cras ullamcorper imperdiet sapien semper ultrices" rel="bookmark">Cras ullamcorper imperdiet sapien semper ultrices</a></h1>
                                </header>
                                <!-- .entry-header -->

                                <div class="entry-summary">
                                    <p>Sed ut metus dolor. Aliquam erat volutpat. Nullam vel magna ligula. Etiam hendrerit semper congue. Duis aliquam mollis sodales. Proin ultricies mattis ante, eu aliquet metus placerat id. In hac habitasse platea dictumst. Praesent ac massa justo, at posuere mi? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in eros eget velit mattis lacinia [&hellip;]</p>
                                </div>
                                <!-- .entry-summary -->


                            </div>

                        </article>
                        <!-- #post-49 -->



                        <article id="post-47" class="post-47 post type-post status-publish format-standard hentry category-asmodeus category-business category-finance category-religion cf">
                            <div class="leftbox">
                                <div class="datebox">
                                    <div class="ddate">9</div>
                                    <div class="dmonth">June</div>
                                </div>
                                <div class="post-author">
                                    Posted by <a href="http://demo.fabthemes.com/ajaxify/author/admin/" title="Posts by admin" rel="author">admin</a>
                                </div>
                                <div class="post-comments">
                                    <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/suspendisse-pellentesque-enim-id-consequat-luctus/#comments" title="Comment on Suspendisse pellentesque, enim id consequat luctus">1 Comment</a>
                                </div>
                                <div class="post-cats">
                                    Posted in <a href="http://demo.fabthemes.com/ajaxify/category/asmodeus/" title="View all posts in Asmodeus" rel="category tag">Asmodeus</a>, <a href="http://demo.fabthemes.com/ajaxify/category/business/" title="View all posts in Business" rel="category tag">Business</a>, <a href="http://demo.fabthemes.com/ajaxify/category/finance/" title="View all posts in Finance" rel="category tag">Finance</a>, <a href="http://demo.fabthemes.com/ajaxify/category/religion/" title="View all posts in Religion" rel="category tag">Religion</a>
                                </div>
                            </div>
                            <div class="rightbox">

                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/suspendisse-pellentesque-enim-id-consequat-luctus/">
                                    <img class="postimg" src="http://cdn.demo.fabthemes.com/ajaxify/files/2012/06/p6-540x300.jpg" /></a>


                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="http://demo.fabthemes.com/ajaxify/2012/06/09/suspendisse-pellentesque-enim-id-consequat-luctus/" title="Permalink to Suspendisse pellentesque, enim id consequat luctus" rel="bookmark">Suspendisse pellentesque, enim id consequat luctus</a></h1>
                                </header>
                                <!-- .entry-header -->

                                <div class="entry-summary">
                                    <p>Donec a imperdiet metus. Nunc id consectetur velit. Vestibulum et urna neque, eget tempus libero. Suspendisse ac neque eu nisi viverra blandit? Sed in urna at purus cursus adipiscing. Maecenas ac nibh odio, quis dictum dolor. Maecenas id velit eu velit tempor dapibus sed non tellus. Nulla quis nisi a turpis auctor volutpat. In mollis [&hellip;]</p>
                                </div>
                                <!-- .entry-summary -->


                            </div>

                        </article>
                        <!-- #post-47 -->


                        <div class="pagination">
                            <span class='page-numbers current'>1</span>
                            <a class='page-numbers' href='http://demo.fabthemes.com/ajaxify/page/2/'>2</a>
                            <a class='page-numbers' href='http://demo.fabthemes.com/ajaxify/page/3/'>3</a>
                            <a class="next page-numbers" href="http://demo.fabthemes.com/ajaxify/page/2/">Next &raquo;</a>
                        </div>



                    </div>
                    <!-- #content .site-content -->
                </div>
                <!-- #primary .content-area -->

                <div id="secondary" class="widget-area grid_2" role="complementary">
                    <div class="corner"></div>
                    <aside id="categories-2" class="widget widget_categories">
                        <h1 class="widget-title">Categories</h1>
                        <ul>
                            <li class="cat-item cat-item-2"><a href="http://demo.fabthemes.com/ajaxify/category/aciform/" title="View all posts filed under Aciform">Aciform</a>
                            </li>
                            <li class="cat-item cat-item-3"><a href="http://demo.fabthemes.com/ajaxify/category/arrangement/" title="View all posts filed under Arrangement">Arrangement</a>
                            </li>
                            <li class="cat-item cat-item-4"><a href="http://demo.fabthemes.com/ajaxify/category/art/" title="View all posts filed under Art">Art</a>
                            </li>
                            <li class="cat-item cat-item-5"><a href="http://demo.fabthemes.com/ajaxify/category/asmodeus/" title="View all posts filed under Asmodeus">Asmodeus</a>
                            </li>
                            <li class="cat-item cat-item-6"><a href="http://demo.fabthemes.com/ajaxify/category/books/" title="View all posts filed under Books">Books</a>
                            </li>
                            <li class="cat-item cat-item-7"><a href="http://demo.fabthemes.com/ajaxify/category/business/" title="View all posts filed under Business">Business</a>
                            </li>
                            <li class="cat-item cat-item-8"><a href="http://demo.fabthemes.com/ajaxify/category/entertainment/" title="View all posts filed under Entertainment">Entertainment</a>
                            </li>
                            <li class="cat-item cat-item-9"><a href="http://demo.fabthemes.com/ajaxify/category/finance/" title="View all posts filed under Finance">Finance</a>
                            </li>
                            <li class="cat-item cat-item-10"><a href="http://demo.fabthemes.com/ajaxify/category/politics/" title="View all posts filed under Politics">Politics</a>
                            </li>
                            <li class="cat-item cat-item-11"><a href="http://demo.fabthemes.com/ajaxify/category/religion/" title="View all posts filed under Religion">Religion</a>
                            </li>
                            <li class="cat-item cat-item-12"><a href="http://demo.fabthemes.com/ajaxify/category/sports/" title="View all posts filed under Sports">Sports</a>
                            </li>
                            <li class="cat-item cat-item-1"><a href="http://demo.fabthemes.com/ajaxify/category/uncategorized/" title="View all posts filed under Uncategorized">Uncategorized</a>
                            </li>
                            <li class="cat-item cat-item-13"><a href="http://demo.fabthemes.com/ajaxify/category/vintage/" title="View all posts filed under Vintage">Vintage</a>
                            </li>
                        </ul>
                    </aside>
                    <aside id="archives-2" class="widget widget_archive">
                        <h1 class="widget-title">Archives</h1>
                        <ul>
                            <li><a href='http://demo.fabthemes.com/ajaxify/2012/06/' title='June 2012'>June 2012</a></li>
                        </ul>
                    </aside>
                    <div class="squarebanner cf">
                        <h3 class="sidetitl">Sponsors </h3>
                        <ul class="cf">


                            <li>
                                <a rel="nofollow" href="http://www.webhostinghub.com/ " title="Web Hosting Hub - Cheap reliable web hosting.">
                                    <img src="http://web2feel.com/images/webhostinghub.png" alt="Cheap reliable web hosting from WebHostingHub.com" style="vertical-align: bottom;" /></a>
                            </li>

                            <li>
                                <a rel="nofollow" href="http://www.pcnames.com/" title="PC Names - Domain name search and availability check.">
                                    <img src="http://web2feel.com/images/pcnames.png" alt="Domain name search and availability check by PCNames.com" style="vertical-align: bottom;" /></a>
                            </li>

                            <li>
                                <a rel="nofollow" href="http://www.designcontest.com/" title="Design Contest - Logo and website design contests.">
                                    <img src="http://web2feel.com/images/designcontest.png" alt="Website and logo design contests at DesignContest.com." style="vertical-align: bottom;" /></a>
                            </li>

                            <li>
                                <a rel="nofollow" href="http://webhostingrating.com" title="Web Hosting Rating - Customer reviews of the best web hosts">
                                    <img src="http://web2feel.com/images/webhostingrating.png" alt="Reviews of the best cheap web hosting providers at WebHostingRating.com" style="vertical-align: bottom;" /></a>
                            </li>



                        </ul>
                    </div>
                </div>
                <!-- #secondary .widget-area -->

            </div>
            <!-- #main .site-main -->

            <div id="bottom" class="container_8">
                <ul>

                    <li class="botwid grid_2 widget_text">
                        <h3 class="bothead">About Us</h3>
                        <div class="textwidget">
                            <p>Donec a imperdiet metus. Nunc id consectetur velit. Vestibulum et urna neque, eget tempus libero. Suspendisse ac neque eu nisi viverra blandit? Sed in urna at purus cursus adipiscing. Maecenas ac nibh odio, quis dictum dolor. Maecenas id velit eu velit tempor dapibus sed non tellus. Nulla quis nisi a turpis auctor volutpat. In moll</p>
                        </div>
                    </li>
                    <li class="botwid grid_2 widget_recent_entries">
                        <h3 class="bothead">Recent Posts</h3>
                        <ul>
                            <li>
                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/10/praesent-sapien-velit/" title="Praesent sapien velit">Praesent sapien velit</a>
                            </li>
                            <li>
                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/aenean-velit-risus-venenatis-sed-pellentesque-ege/" title="Aenean velit risus, venenatis sed pellentesque ege">Aenean velit risus, venenatis sed pellentesque ege</a>
                            </li>
                            <li>
                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/phasellus-justo-quam-commodo-sit-amet-pharetra/" title="Phasellus justo quam, commodo sit amet pharetra">Phasellus justo quam, commodo sit amet pharetra</a>
                            </li>
                            <li>
                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/cras-ullamcorper-imperdiet-sapien-semper-ultrices/" title="Cras ullamcorper imperdiet sapien semper ultrices">Cras ullamcorper imperdiet sapien semper ultrices</a>
                            </li>
                            <li>
                                <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/suspendisse-pellentesque-enim-id-consequat-luctus/" title="Suspendisse pellentesque, enim id consequat luctus">Suspendisse pellentesque, enim id consequat luctus</a>
                            </li>
                        </ul>
                    </li>
                    <li class="botwid grid_2 widget_recent_comments">
                        <h3 class="bothead">Recent Comments</h3>
                        <ul id="recentcomments">
                            <li class="recentcomments">Jinsona on <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/cras-ullamcorper-imperdiet-sapien-semper-ultrices/#comment-4">Cras ullamcorper imperdiet sapien semper ultrices</a></li>
                            <li class="recentcomments">Jinsona on <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/aenean-velit-risus-venenatis-sed-pellentesque-ege/#comment-6">Aenean velit risus, venenatis sed pellentesque ege</a></li>
                            <li class="recentcomments">Jinsona on <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/phasellus-justo-quam-commodo-sit-amet-pharetra/#comment-5">Phasellus justo quam, commodo sit amet pharetra</a></li>
                            <li class="recentcomments">Jinsona on <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/suspendisse-pellentesque-enim-id-consequat-luctus/#comment-3">Suspendisse pellentesque, enim id consequat luctus</a></li>
                            <li class="recentcomments"><a href='http://wordpress.org/' rel='external nofollow' class='url'>Mr WordPress</a> on <a href="http://demo.fabthemes.com/ajaxify/2012/06/09/hello-world-2/#comment-2">Hello world!</a></li>
                        </ul>
                    </li>
                    <li class="botwid grid_2 widget_meta">
                        <h3 class="bothead">Meta</h3>
                        <ul>
                            <li><a href="http://demo.fabthemes.com/ajaxify/wp-login.php">Log in</a></li>
                            <li><a href="http://demo.fabthemes.com/ajaxify/feed/" title="Syndicate this site using RSS 2.0">Entries
                                <abbr title="Really Simple Syndication">RSS</abbr></a></li>
                            <li><a href="http://demo.fabthemes.com/ajaxify/comments/feed/" title="The latest comments to all posts in RSS">Comments
                                <abbr title="Really Simple Syndication">RSS</abbr></a></li>
                            <li><a href="http://wordpress.org/" title="Powered by WordPress, state-of-the-art semantic personal publishing platform.">WordPress.org</a></li>
                        </ul>
                    </li>
                </ul>

                <div class="clear"></div>
            </div>

            <footer id="colophon" class="site-footer" role="contentinfo">
                <div class="site-info">
                    <div class="fcred">
                        Copyright &copy; 2013 <a href="http://demo.fabthemes.com/ajaxify" title="Ajaxify">Ajaxify</a> - Just another demo Sites site.<br />
                        | <a href="http://topwpthemes.com/Ajaxify/">Ajaxify Theme</a>
                    </div>

                </div>
                <!-- .site-info -->
            </footer>
            <!-- #colophon .site-footer -->
        </div>
        <!-- #page .hfeed .site -->
    </div>
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/js/jquery.ba-hashchange.min.js?ver=3.6.1'></script>
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/js/ajaxing.js?ver=3.6.1'></script>
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/js/superfish.js?ver=20120206'></script>
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-content/themes/Ajaxify/js/custom.js?ver=20120206'></script>
    <script type='text/javascript' src='http://cdn.demo.fabthemes.com/ajaxify/wp-content/plugins/cart66-lite/js/cart66-library.js?ver=1.5.1.15'></script>

</body>
</html>
<!-- Performance optimized by W3 Total Cache. Learn more: http://www.w3-edge.com/wordpress-plugins/

Content Delivery Network via cdn.demo.fabthemes.com

 Served from: demo.fabthemes.com @ 2013-11-04 08:52:16 by W3 Total Cache -->
