
let totalAmount ="1.101";
let [s1, s2] = totalAmount.split('.');
    console.log(s1, s2)
    let len = '000000000';
    let final;
    if (s2) {
        console.log("s2:",s2.length)
      let len2 = len.slice(s2.length)
      console.log("le2:",len2)
      let str = s2 + len2;
      console.log(str,s2);
      final = s1 + str;
      // final = final.slice(s2.length)
      console.log(Number(final),Number(final.length))

    } else {
      final = s1 + len;
    }
    console.log("final:", final,final.length)