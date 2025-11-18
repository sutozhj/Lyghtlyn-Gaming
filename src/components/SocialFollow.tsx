import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Facebook, Youtube, MessageCircle } from 'lucide-react'

const SocialFollow = () => {
  return (
    <>
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-lg text-white">Follow Us</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 border-gray-700 text-white hover:bg-primary-700"
            onClick={() => window.open('https://facebook.com', '_blank')}
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 border-gray-700 text-white hover:bg-primary-700"
            onClick={() => window.open('https://youtube.com', '_blank')}
          >
            <Youtube className="h-4 w-4" />
            <span>YouTube</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 border-gray-700 text-white hover:bg-primary-700"
            onClick={() => window.open('https://discord.com', '_blank')}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Discord</span>
          </Button>
        </div>
      </CardContent>
    </>
  )
}

export default SocialFollow

