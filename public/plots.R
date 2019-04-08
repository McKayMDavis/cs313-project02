data <- read.csv("./public/temp.csv")

library(ggplot2)
library(magrittr)
p <- data %>%
  ggplot(aes(x = date_entered, y = amount, fill = date_entered)) +
  geom_boxplot() +
  theme_bw()


tryCatch(ggsave("temp.png", p, "png", "./public/", height = 6, width = 10)
, warning = function(w) {
  cat(w)
}, error = function(e) {
  cat(e)
})