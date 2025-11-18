import { Card } from './ui/card'

interface ArticleAuthorProps {
  name: string
  avatar: string
  bio: string
}

const ArticleAuthor = ({ name, avatar, bio }: ArticleAuthorProps) => {
  return (
    <Card className="p-4 bg-[#1A1A2E]/95 border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <img 
          src={avatar} 
          alt={name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-xs text-gray-400">Author</p>
        </div>
      </div>
      <p className="text-sm text-gray-400">{bio}</p>
    </Card>
  )
}

export default ArticleAuthor

