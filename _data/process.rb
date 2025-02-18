require 'csv'

# from Rosetta code https://rosettacode.org/wiki/Determine_if_a_string_is_numeric#Ruby
def is_numeric?(s)
  !!Float(s, exception: false)
end

# adapted from SO https://stackoverflow.com/questions/1791639/converting-upper-case-string-into-title-case-using-ruby
def titlecase(str)
  notcap = %w[and the a in of an]
  res = ''
  str.split do |word|
    word.downcase!
    word.capitalize! unless notcap.include? word
    res += ' ' + word
  end
  res.strip
end

# load in the data
data = CSV.parse(File.read('FoR-Codes-2020.csv'))

# process it and write it back out
CSV.open('FoR-Codes-2020-processed.csv', 'w') do |csv|
  data.each_index do |index|
    # fix up the Division
    data[index][0] = titlecase(data[index][1]) if is_numeric? data[index][0]
    data[index][0] = data[index - 1][0] unless data[index][0]
    # fix up the Group
    data[index][1] = data[index][2] if is_numeric? data[index][1]
    data[index][1] = data[index - 1][1] unless data[index][1]

    # write it all back to a file
    csv << data[index] if data[index][3]
  end
end
