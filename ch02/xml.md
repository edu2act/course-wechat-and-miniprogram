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
    <Content>中午找你吃饭</Content>
</message>
```

**XML并没有做什么**

这似乎不可思议，但是使用多了就会发现，XML并没有做什么，仅仅是对数据进行了格式化处理，而用于描述的标签是需要自己定义的。但是使用XML标记的数据具备自我描述性。

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

#### **XML示例**

```

```



#### **解析XML**

解析XML，NodeJS有很多可用的扩展。这里使用了xml2js作为NodeJS的XML解析。
