require 'rubygems' 
require 'sinatra'
require 'sinatra/reloader'

require "fileutils"
require 'omniauth'
require 'omniauth-twitter'
require 'twitter'
require './src/insert_message.rb'

require 'clockwork'

$image_path = ''

configure do
  enable :sessions

  use OmniAuth::Builder do
    provider :twitter, ENV['TWITTER_CONSUMER_KEY'], ENV['TWITTER_CONSUMER_SECRET']
  end
end

before do
  @title = 'ゆゆ式アイコンツール'
  @img = '/images/yuzuko_origin.png'  
end

get '/' do
  @oauth = session[:user_name]
  erb :index
end


post '/upload_image' do   # 画像共有用
  if session[:oauth_token] == nil
    redirect '/auth/twitter'
  else
    # 画像生成
    $image_path = '/images/' + params[:character] + '_origin.png'
    if params[:message] != ""
      source_path = './public' + $image_path
      $image_path = InsertMessage.new(source_path).insert_message(params[:message])  
      $image_path.sub!(/public/, "")
      $image_path[0, 2] = ''
    end

    twitter_client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token        = session[:oauth_token]
      config.access_token_secret = session[:oauth_token_secret]
    end

    twitter_client.update_with_media("", open("./public" + $image_path))
    FileUtils.rm("./public" + $image_path, {:force => true}) 
  end
end

get '/auth/failure' do  #認証失敗
  redirect '/'
end

get '/auth/:provider/callback' do   #認証成功
  auth = request.env["omniauth.auth"]
  session[:oauth_token] = auth.credentials.token
  session[:oauth_token_secret] = auth.credentials.secret
  session[:user_name] = auth.extra.access_token.params[:screen_name]
  
  redirect '/'
end

get '/session_clear' do
  session.clear
  redirect '/'
end

post '/download' do   #ダウンロードURL
  delete_file
  # 画像生成
  $image_path = '/images/' + params[:character] + '_origin.png'
  if params[:message] != ""
    source_path = './public' + $image_path
    $image_path = InsertMessage.new(source_path).insert_message(params[:message])  
    $image_path.sub!(/public/, "")
    $image_path[0, 2] = ''
    p $image_path
  end
end

def delete_file
  p "delete"
  files = Dir.glob("./public/images/*.png")
  files.each { |file|
    if file.match(/(yuzuko|yukari|yui){1}[0-9]+[.]{1}(png)/)
      if Time.now - File::stat(file).ctime > 60
        FileUtils.rm(file, {:force => true})       
      end
    end
  }
end


post '*' do
  redirect '/'
end

get '*' do
  redirect '/'
end