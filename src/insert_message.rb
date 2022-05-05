# coding: UTF-8
require 'date'
require 'fileutils'
require 'rmagick'

class InsertMessage 
  def initialize(img_file)
    @img_file_org = img_file.dup
    @img_file = img_file.sub!(/_origin.png/, '')
  end

  def insert_message(message)
    @img_file += Time.now.to_i.to_s + ".png"
    FileUtils.cp(@img_file_org, @img_file, {:preserve => true}) # 元画像退避
    img = Magick::ImageList.new(@img_file) # 画像オブジェクト
    draw = Magick::Draw.new                # 描画オブジェクト

    begin
      draw.annotate(img, 0, 0, 0, -175, message) do
        self.fill = 'black'
        self.stroke = 'transparent'
        self.pointsize = 80
        self.gravity = Magick::CenterGravity
      end
      
      img.write(@img_file)
    rescue => e
      STDERR.puts "[ERROR][#{self.class.name}.insert_message] #{e}"
      exit 1
    end
    return @img_file
  end
end
