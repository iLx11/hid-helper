let str = ``

const decodeUsagePage = () => {
  let usesage_page = []
  let strExp = /\s(\[\d+\])|(\s\d+$)/gi

  /*let strExp = /(\s\d+$)/gi
  let page_id_exp = /^\S+\s/gi
  let page_name_exp = /\s(?<=^\S+\s).+/gi*/
  // (OSC\/DF|DV\/DF|DVMC\/DV|MC\/DV|OSC|CP|CA|DL|DF|DV|SV|US|CL|RTC|OOC|Sel|NAry|See\sNote|UM|MC|RTC)

  let page_id_exp = /(?<=^\S+)\s.+/gi
  let page_name_exp = /(?<=^\S+\s)(.+)(?= (OSC\/DF|OSC\/NAry|CL\/CP|CL\/SV|CL\/CA|SV\/DV|CA\/CP|SF\/DF|DV\/DF|CA\/CL|DV\/SV|DVMC\/DV|SV\/CL|NAry\/CL|SF\/DF\/DV|Buffered\sBytes|MC\/DV|OSC|LC|CP|CA|DL|DF|SF|DV|SV|US|CL|RTC|OOC|Sel|NAry|See\sNote|UM|MC|RTC))/gi
  let page_tyeps_exp = /(OSC\/DF|OSC\/NAry|CL\/CP|CL\/SV|CL\/CA|SV\/DV|CA\/CP|SF\/DF|DV\/DF|CA\/CL|DV\/SV|DVMC\/DV|SV\/CL|NAry\/CL|SF\/DF\/DV|Buffered\sBytes|MC\/DV|OSC|LC|CP|CA|DL|DF|SF|DV|SV|US|CL|RTC|OOC|Sel|NAry|See\sNote|UM|MC|RTC)/g
  str.split(/\n/g).forEach(o => {
    if (/\s/gi.test(o))
      usesage_page.push({
        'Usage_ID': o.replace(strExp, '').replace(page_id_exp, ''),
        'Usage_Name': o.replace(strExp, '').match(page_name_exp) == null ? 'Reserved' : o.replace(strExp, '').match(page_name_exp)[0],
        'Usage_Types': o.replace(strExp, '').match(page_tyeps_exp) == null ? 'Undefined' : o.replace(strExp, '').match(page_tyeps_exp)[0]
      })
  })
  console.log(JSON.stringify(usesage_page))
  console.log(usesage_page)
}

const decodeUsageString = () => {
  let final = {}
  let page_tyeps_exp = /(OSC\/DF|OSC\/NAry|CL\/CP|CL\/SV|CL\/CA|SV\/DV|CA\/CP|SF\/DF|DV\/DF|CA\/CL|DV\/SV|DVMC\/DV|SV\/CL|NAry\/CL|SF\/DF\/DV|Buffered\sBytes|MC\/DV|OSC|LC|CP|CA|DL|DF|SF|DV|SV|US|CL|RTC|OOC|Sel|NAry|See\sNote|UM|MC|RTC)/g
  let page_title_exp = /(\d{1}.\d{1,2}\s)|(\d{1}.\d{1,2}.\d{1,2}\s)/g
  let tempObj = ''
  let branch = ''
  let tempStr = ''
  str.split(/Usage Name Usage Type Description/gim).forEach((o, i) => {
    o.split(page_tyeps_exp).forEach(x => {
      if (page_title_exp.test(x)) {
        x.split(/\n/g).forEach(k => {

          if (k.match(/^(\d{1,2}.\d{1,2}\s).+/g) != null) {
            tempObj = k.match(/^(\d{1,2}.\d{1,2}\s).+/g)[0].replace(page_title_exp, '').replace(/\s/g, '_').replace(/^\d/, '')
            branch = ''
          }
          if (k.match(/^(\d{1,2}.\d{1,2}.\d{1,2}\s).+/g) != null) {
            branch = k.match(/^(\d{1,2}.\d{1,2}.\d{1,2}\s).+/g)[0].replace(page_title_exp, '').replace(/\s/g, '_').replace(/^\d/, '')
          }
        })
        if (final[tempObj] == null) final[tempObj] = []
        if (branch != '' && final[tempObj][final[tempObj].length - 1] == null) {
          final[tempObj].push({})
        }
        if(branch != '') final[tempObj][final[tempObj].length - 1][branch] = []
      } else {
        x.split(/\n/g).forEach(k => {
          k = k.replace(/\s$/g, '')
          if (k.length < 35 && /^[A-Z]/g.test(k) && !/\.$/g.test(k)) {
            if (branch != '') {
            	if (!page_tyeps_exp.test(k)) {
                tempStr += k
                tempStr += '/'
              } else {
                tempStr = tempStr.replace(/\/$/g, '')
                final[tempObj][final[tempObj].length - 1][branch].push({ 'Usage_Name': tempStr, 'Usage_type': k })
                tempStr = ''
              }
              // branch = ''
            } else {
              if (!page_tyeps_exp.test(k)) {
                tempStr += k
                tempStr += '/'
              } else {
                tempStr = tempStr.replace(/\/$/g, '')
                final[tempObj].push({ 'Usage_Name': tempStr, 'Usage_type': k })
                tempStr = ''
              }

            }
          }
        })

      }
    })
  })
  console.log(final)
  console.log(JSON.stringify(final))
}
document.querySelector('#left').addEventListener('click', () => {
  str = document.querySelector('#text').value
  decodeUsagePage()
})
document.querySelector('#right').addEventListener('click', () => {
  str = document.querySelector('#text').value
  decodeUsageString()
})