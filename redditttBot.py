import praw
import datetime
from googletrans import Translator



reddit = praw.Reddit(
    client_id="vZcw1WET3sMc3Q",
    client_secret="9hYg4WNU7ckcHUDBactwCYypIMqUeg",
    user_agent="<console: trading: 1.0>",
)


class Sub:
    user = None

    def __init__(self, sub):
        self.sub = sub
        self.subreddit = reddit.subreddit(self.sub).new(limit=None)
        self.user = reddit.redditor(self.sub).comments.new(limit=None)
        self.post_user = reddit.redditor(self.sub).submissions.new(limit=None)

    def sub_post(self, title=None):
        for post in self.subreddit:
            for keys in title:
                if keys in post.title.lower():
                    date_posted = datetime.datetime.fromtimestamp(post.created)
                    print(f"{post.title}\nAuthor: {post.author}\nDate: {date_posted}\n----------")

    def sub_comment(self, comment_title=None):
        for post in self.subreddit:
            for comment in post.comments:
                if hasattr(comment, 'body'):
                    if any(com in comment.body.lower() for com in comment_title):
                        date_posted = datetime.datetime.fromtimestamp(comment.created)
                        translator = Translator()
                        sub_comment = f"\n{comment.body} \nAuthor: {comment.author}\nDate: {date_posted}\n----------"
                        sub_comment = translator.translate(sub_comment)
                        print(sub_comment.text)

    def user_post(self, title=None):
        for post in self.post_user:
            for keys in title:
                if keys in post.title.lower():
                    date_posted = datetime.datetime.fromtimestamp(post.created)
                    print(f"{post.title}\nAuthor: {post.author}\nDate: {date_posted}\n----------")

    def user_comment(self, comment_title=None):
        for comment in self.user:
            if hasattr(comment, 'body'):
                if any(com in comment.body.lower() for com in comment_title):
                    date_posted = datetime.datetime.fromtimestamp(comment.created)
                    user_comment = f"\n{comment.body} \nAuthor: {comment.author}\nDate: {date_posted} \nLink: {comment.permalink}\nUpvotes: {comment.score}\n----------"
                    print(user_comment)
                    break

    def user_nsfw(self):
        for comment in self.user:
            if hasattr(comment, "body") and comment.over_18:
                date_posted = datetime.datetime.fromtimestamp(comment.created)
                user_comment = user_comment = f"\n{comment.body} \nAuthor: {comment.author}\nDate: {date_posted}\nLink: {comment.permalink}\n----------"
                print(user_comment)
                #hell


translator = Translator()
sub1 = Sub("GovSchwarzenegger")
sub1.user_comment(("age",))
