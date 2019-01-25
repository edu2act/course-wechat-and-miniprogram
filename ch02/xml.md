#### **XML基础**

XML是可扩展标记语言(Extensible Markup Language )的缩写。 XML很像超文本标记语言的标记语言，因为格式很相似。但是XML的标签没有被预定义,需要自行定义标签。XML与HTML的差异:
* XML不是HTML的替代。
* XML用于表示信息的结构，而HTML重点在于信息的展示。
* XML需要开发者自己定义标签。

先认识一下XML：

``` XML
<message>
    <from>金刚狼</from>
    <to>Beast</to>
    <content>中午请你吃饭</content>
</message>
```

XML仅仅是对数据进行了格式化处理，而用于描述的标签是需要自己定义的。但是使用XML标记的数据具备自我描述性。XML的规则以及基于XML的扩展功能提供了非常强大的能力。

**XML与JSON**

尽管目前在Web领域似乎JSON关注度比较高，但是XML的地位可以和HTML并列，而且我们使用的大量工具其内部都使用了XML，其中就包括Office、WPS等办公软件，其内部就是XML文档与媒体文件的组合。


#### **XML语法规则**
* 必须有根元素
* 所有的元素都必须有一个闭合标签
* 标签对大小写敏感
* 属性必须加引号
* 标签必须被正确嵌套
* 多个空格会被保留（HTML会把多个空格缩减为1个）
* XML声明存在必须放在第一行，但这不是必需的：

``` XML
<?xml version="1.0" encoding="utf-8" ?>
```

**XML注释**

XML的注释和HTML使用的方式一致：

``` XML
<!-- 这是一段XML的注释 -->
```

#### **XML正确格式与错误格式示例**

``` XML
<!--这是正确的格式，并且xml的声明可以去掉-->
<?xml version="1.0" encoding="utf-8" ?>
<person>
    <name>Brave</name>
    <age>28</age>
    <identity>Programmer</identity>
<person>

<!--这是正确的格式-->
<person>
    <name id="1001">Brave</name>
    <age>28</age>
    <identity>Programmer</identity>
<person>

<!--这是错误的格式，没有根元素-->
    <name>Brave</name>
    <age>28</age>
    <identity>Programmer</identity>

<!--这是错误的格式，标签大小写不一致-->
<person>
    <name>Brave</Name>
    <age>28</age>
    <identity>Programmer</identity>
</person>

<!--这是错误的格式，属性没有加引号-->
<person>
    <name id=1001>Brave</Name>
    <age>28</age>
    <identity>Programmer</identity>
</person>


```

#### **XML CDATA**

对于以下数据，解析操作会把所有文本当作XML解析，但是content字段的内容不想被解析，这时候要使用CDATA。

``` XML
<message>
    <from>A</from>
    <to>B</to>
    <content>
        <p>First</p>
        <p>Second</p>
    </content>
</message>

<!-- 要想content字段内容不被解析，需要使用CDATA包含 -->
<message>
    <from>A</from>
    <to>B</to>
    <content>
        <![CDATA[
        <p>First</p>
        <p>Second</p>
        ]]>
    </content>
</message>

```

```
CDATA使用从<![CDATA[开始，以]]>结束。]]>中间不能有任何字符。
并且CDATA中间不能有]]>字符，也不能嵌套CDATA。
```



#### **解析XML**

解析XML，NodeJS有很多可用的扩展。这里使用了xml2js作为NodeJS的XML解析。
