// 过滤器

let filter = {}

filter.install = function (Vue)
{
    Vue.filter('unEncrypt', val =>
    {

        val = val.split("/").reverse()[1];
        if (val.charAt(0) == '+')
        {
            val = val.substring(1, val.length);
            var k = val.split(",");
            var result = "";
            for (var i = 0; i < k.length; i++)
            {
                //console.log("result:"+result)
                result += String.fromCharCode(k[i]);
            }
            
            return result;

        } else
        {
            var result = val;
            return result;
        }

        // //vue-cli时用
        // return val;
    })
}
// function unEncrypt(s)
// {
//     var k = s.split(",");
//     var rs = "";
//     for (var i = 0; i < k.length; i++)
//     {
//         rs += String.fromCharCode(k[i]);
//     }
//     return rs;
// }
export default filter