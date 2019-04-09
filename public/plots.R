args <- commandArgs(TRUE)
csvpath <- args[1]
pngpath <- args[2]
pngname <- args[3]
data <- read.csv(csvpath)

library(ggplot2)
library(magrittr)
p <- data %>%
  ggplot(aes(x = date_entered, y = amount, fill = date_entered)) +
  geom_boxplot() +
  theme_bw()


tryCatch(ggsave(pngname, p, "png", pngpath, height = 6, width = 10)
, warning = function(w) {
  cat(w)
}, error = function(e) {
  cat(e)
})


# png(filename = "/app/web/prove_05/temp.png", width = 500, height = 500)
# plot(data$date_entered, data$amount)
# dev.off()