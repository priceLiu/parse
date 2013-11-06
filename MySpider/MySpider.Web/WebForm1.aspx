<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="MySpider.Web.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        html {
            color: #000;
            background-color: transparent;
        }

        body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
        }

        fieldset, img {
            border: 0;
        }

        address, caption, cite, code, dfn, em, strong, th, var {
            font-style: normal;
            font-weight: normal;
        }

        ol, ul {
            list-style: none;
        }

        caption, th {
            text-align: left;
        }

        h1, h2, h3, h4, h5, h6 {
            font-size: 100%;
            font-weight: normal;
        }

        q:before, q:after {
            content: '';
        }

        abbr, acronym {
            border: 0;
            font-variant: normal;
        }

        sup {
            vertical-align: text-top;
        }

        sub {
            vertical-align: text-bottom;
        }

        input, textarea, select {
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
        }

        input, textarea, select {
            *font-size: 100%;
        }

        legend {
            color: #000;
        }

        body {
            margin: 0;
            padding: 0;
        }

        .bd-logo, .bd-logo2, .bd-logo3 {
            text-decoration: none;
            cursor: pointer;
            display: block;
            overflow: hidden;
            position: absolute;
            bottom: 0px;
            right: 0px;
            z-index: 2147483647;
        }

        .bd-logo {
            height: 18px;
            width: 18px;
            background: url(http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/bg.png) no-repeat left top;
            background-position: 0px 0px;
            _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/logo-border-light.png",sizingMethod="crop");
            _background: none;
        }

            .bd-logo:hover {
                background-position: -70px 0px;
                _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/logo-border-dark.png",sizingMethod="crop");
            }

        .bd-logo2 {
            margin: 0 2px 2px 0;
            height: 14px;
            width: 13px;
            background: url(http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/bg.png) no-repeat left top;
            background-position: 0px -20px;
            _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/logo-noborder-light.png",sizingMethod="crop");
            _background: none;
        }

            .bd-logo2:hover {
                background-position: 0px -35px;
                _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/logo-noborder-dark.png",sizingMethod="crop");
            }

        .bd-logo3 {
            height: 18px;
            width: 18px;
            background: url(http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/bg.png) no-repeat left top;
            background-position: -70px 0px;
            _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.1/logo-border-dark.png",sizingMethod="crop");
            _background: none;
        }

            .bd-logo3:hover {
                width: 68px;
            }

        .loader {
            text-align: center;
            width: 90%;
            font-size: 12px;
            padding: 8px;
            border: solid 1px #aaaaaa;
            margin-top: 30px;
            display: none;
        }

        .cf:before, .cf:after {
            content: "\20";
            display: table;
        }

        .cf:after {
            clear: both;
        }

        .cf {
            *zoom: 1;
        }

        .textOverflow {
            white-space: nowrap;
            overflow: hidden;
            display: inline-block;
            width: 100%;
        }

        .textOverflowEllipsis {
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }

        .textOverflowClip {
            -o-text-overflow: clip;
            text-overflow: clip;
        }

        body {
            margin: 0;
            padding: 0;
        }

        .container {
            position: relative;
        }

        a {
            display: inline-block;
            position: absolute;
            background: #fff;
            text-align: center;
            overflow: hidden;
            color: #fff;
            font-family: "微软雅黑";
            text-decoration: none;
        }

        .block1 {
            font-size: 24px;
        }

        .block2 {
            font-size: 20px;
        }

        .block2_5 {
            font-size: 18px;
        }

        .block2_6 {
            font-size: 16px;
        }

        .block2_7 {
            font-size: 14px;
        }

        .block3 {
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container" id="container" style="width: 728px; height: 90px;">
        <a onfocus="this.blur()" target="_blank" title="百度网盟推广" href="http://wangmeng.baidu.com/" class="bd-logo"></a>
        <a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%CD%AC%B7%BF%BA%F3%B3%F6%D1%AA&amp;k0=%CD%AC%B7%BF%BA%F3%B3%F6%D1%AA&amp;k1=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k2=%C6%FB%B3%B5%BB%AE%BA%DB%D0%DE%B8%B4&amp;k3=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k4=%D0%C2%B3%B5%BB%B7%B1%A3%B1%EA%D6%BE&amp;k5=%D3%F0%C3%AB%C7%F2%C8%BA&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block1" style="top: 30px; left: 312px; line-height: 60px; height: 60px; width: 206px; background-color: rgb(173, 104, 215);">aaa</a>
        <a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k0=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k1=%C6%FB%B3%B5%BB%AE%BA%DB%D0%DE%B8%B4&amp;k2=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k3=%D0%C2%B3%B5%BB%B7%B1%A3%B1%EA%D6%BE&amp;k4=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k5=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block1" style="top: 0px; left: 520px; line-height: 58px; height: 58px; width: 208px; background-color: rgb(173, 104, 215);">羽毛球群</a>
        <a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%C6%FB%B3%B5%BB%AE%BA%DB%D0%DE%B8%B4&amp;k0=%C6%FB%B3%B5%BB%AE%BA%DB%D0%DE%B8%B4&amp;k1=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k2=%D0%C2%B3%B5%BB%B7%B1%A3%B1%EA%D6%BE&amp;k3=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k4=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;k5=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block2 block2_6" style="top: 30px; left: 104px; line-height: 60px; height: 60px; width: 102px; background-color: rgb(73, 192, 129);">汽车划痕修复</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k0=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k1=%D0%C2%B3%B5%BB%B7%B1%A3%B1%EA%D6%BE&amp;k2=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k3=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;k4=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;k5=%B3%B5%C1%BE%C4%EA%C6%B1&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block2 block2_5" style="top: 0px; left: 0px; line-height: 58px; height: 58px; width: 102px; background-color: rgb(113, 205, 201);">科鲁兹改装</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%D0%C2%B3%B5%BB%B7%B1%A3%B1%EA%D6%BE&amp;k0=%D0%C2%B3%B5%BB%B7%B1%A3%B1%EA%D6%BE&amp;k1=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k2=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;k3=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;k4=%B3%B5%C1%BE%C4%EA%C6%B1&amp;k5=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block2 block2_6" style="top: 0px; left: 208px; line-height: 58px; height: 58px; width: 102px; background-color: rgb(113, 205, 201);">新车环保标志</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k0=%D3%F0%C3%AB%C7%F2%C8%BA&amp;k1=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;k2=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;k3=%B3%B5%C1%BE%C4%EA%C6%B1&amp;k4=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k5=%CD%F8%D2%B3%C9%E8%BC%C6&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 60px; left: 624px; line-height: 30px; height: 30px; width: 104px; background-color: rgb(108, 195, 223);">羽毛球群</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;k0=%BF%C6%C2%B3%D7%C8+%B8%C4%D7%B0&amp;k1=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;k2=%B3%B5%C1%BE%C4%EA%C6%B1&amp;k3=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k4=%CD%F8%D2%B3%C9%E8%BC%C6&amp;k5=%C6%FB%B3%B5%D3%C3%C6%B7&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 0px; left: 104px; line-height: 28px; height: 28px; width: 102px; background-color: rgb(211, 129, 226);">科鲁兹 改装</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;k0=%BC%EC%B2%E2%C9%E8%B1%B8%B3%A7&amp;k1=%B3%B5%C1%BE%C4%EA%C6%B1&amp;k2=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k3=%CD%F8%D2%B3%C9%E8%BC%C6&amp;k4=%C6%FB%B3%B5%D3%C3%C6%B7&amp;k5=%BB%AE%BA%DB%D0%DE%B8%B4&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 60px; left: 208px; line-height: 30px; height: 30px; width: 102px; background-color: rgb(108, 195, 223);">检测设备厂</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%B3%B5%C1%BE%C4%EA%C6%B1&amp;k0=%B3%B5%C1%BE%C4%EA%C6%B1&amp;k1=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k2=%CD%F8%D2%B3%C9%E8%BC%C6&amp;k3=%C6%FB%B3%B5%D3%C3%C6%B7&amp;k4=%BB%AE%BA%DB%D0%DE%B8%B4&amp;k5=%C6%FB%B3%B5%D1%F8%BB%A4%C3%C0%C8%DD&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 60px; left: 520px; line-height: 30px; height: 30px; width: 102px; background-color: rgb(71, 146, 255);">车辆年票</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k0=%BF%C6%C2%B3%D7%C8%B8%C4%D7%B0&amp;k1=%CD%F8%D2%B3%C9%E8%BC%C6&amp;k2=%C6%FB%B3%B5%D3%C3%C6%B7&amp;k3=%BB%AE%BA%DB%D0%DE%B8%B4&amp;k4=%C6%FB%B3%B5%D1%F8%BB%A4%C3%C0%C8%DD&amp;k5=%C6%FB%B3%B5%BB%AE%BA%DB&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 0px; left: 312px; line-height: 28px; height: 28px; width: 102px; background-color: rgb(255, 187, 57);">科鲁兹改装</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%CD%F8%D2%B3%C9%E8%BC%C6&amp;k0=%CD%F8%D2%B3%C9%E8%BC%C6&amp;k1=%C6%FB%B3%B5%D3%C3%C6%B7&amp;k2=%BB%AE%BA%DB%D0%DE%B8%B4&amp;k3=%C6%FB%B3%B5%D1%F8%BB%A4%C3%C0%C8%DD&amp;k4=%C6%FB%B3%B5%BB%AE%BA%DB&amp;k5=%D5%E6%C8%CB%CA%B5%D5%BD&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 0px; left: 416px; line-height: 28px; height: 28px; width: 102px; background-color: rgb(108, 195, 223);">网页设计</a><a href="http://cpro.baidu.com/cpro/ui/uijs.php?rs=1&amp;u=http%3A%2F%2Fwww%2Euisdc%2Ecom%2Fdata%2Dwebsite%2Dgallery&amp;p=baidu&amp;c=news&amp;n=10&amp;t=tpclicked3_hc&amp;q=12086019_cpr&amp;k=%C6%FB%B3%B5%D3%C3%C6%B7&amp;k0=%C6%FB%B3%B5%D3%C3%C6%B7&amp;k1=%BB%AE%BA%DB%D0%DE%B8%B4&amp;k2=%C6%FB%B3%B5%D1%F8%BB%A4%C3%C0%C8%DD&amp;k3=%C6%FB%B3%B5%BB%AE%BA%DB&amp;k4=%D5%E6%C8%CB%CA%B5%D5%BD&amp;k5=%CD%AC%B7%BF%BA%F3%B3%F6%D1%AA&amp;sid=aeb1735c5a95cfdc&amp;ch=0&amp;tu=u1298716&amp;jk=aebfb8b295486fca&amp;cf=1&amp;fv=11&amp;stid=5&amp;urlid=0" target="_blank" class="block3" style="top: 60px; left: 0px; line-height: 30px; height: 30px; width: 102px; background-color: rgb(164, 222, 158);">汽车用品</a>
    </div>
</body>
</html>
